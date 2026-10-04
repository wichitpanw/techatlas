let runtime;
let runIndex = 0;
importScripts('./python-tracer.js');
const normalize = (value) =>
  String(value)
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => line.trimEnd())
    .join("\n")
    .trim();
async function execute(code, inputs, files, tracing = false) {
  const trace = [];
  const lines = [],
    prompts = [];
  runtime.setStdout({ batched: (line) => lines.push(line) });
  runtime.setStderr({ batched: (line) => lines.push(line) });
  const scope = runtime.globals.get("dict")();
  const inputValues = runtime.toPy(inputs || []);
  scope.set("_lab_input_values", inputValues);
  const promptValues = runtime.toPy([]);
  scope.set("_lab_prompts", promptValues);
  const folder = `/home/pyodide/lab_${++runIndex}`;
  runtime.FS.mkdir(folder);
  const moduleNames = [];
  let moduleValues;
  try {
    for (const [name, content] of Object.entries(files || {})) {
      if (!/^[a-zA-Z_][a-zA-Z0-9_]*\.py$/.test(name))
        throw new Error("ชื่อไฟล์โมดูลไม่ถูกต้อง");
      runtime.FS.writeFile(`${folder}/${name}`, content, { encoding: "utf8" });
      moduleNames.push(name.slice(0, -3));
    }
    scope.set("_lab_folder", folder);
    moduleValues = runtime.toPy(moduleNames);
    scope.set("_lab_module_names", moduleValues);
    await runtime.runPythonAsync(
      'import sys as _lab_runtime_sys\nfor _lab_module in _lab_module_names:\n    _lab_runtime_sys.modules.pop(_lab_module, None)\n_lab_runtime_sys.path.insert(0, _lab_folder)\ndef input(prompt=""):\n    _lab_prompts.append(str(prompt))\n    if not _lab_input_values:\n        raise EOFError("ข้อมูลนำเข้าไม่พอ: ใส่หนึ่งบรรทัดต่อ input() ในช่องข้อมูลนำเข้า")\n    return str(_lab_input_values.pop(0))\n',
      { globals: scope },
    );
    if (tracing) {
      scope.set('_lab_trace_emit', (json) => trace.push({ ...JSON.parse(json), output: lines.join('\n') }));
      scope.set('_lab_trace_source', self.PYTHON_TRACE_SETUP);
    }
    try {
      scope.set('_lab_user_source', code);
      await runtime.runPythonAsync(tracing ? "exec(_lab_trace_source)\ntry:\n    exec(compile(_lab_user_source, 'main.py', 'exec'))\nfinally:\n    _lab_sys.settrace(None)" : "exec(compile(_lab_user_source, 'main.py', 'exec'))", { globals: scope });
    } catch (error) {
      error.labTrace = trace;
      error.labOutput = lines.join('\n');
      throw error;
    } finally {
      if (tracing) await runtime.runPythonAsync('_lab_sys.settrace(None)', { globals: scope });
    }
    prompts.push(...promptValues.toJs());
    return { output: lines.join("\n"), prompts, trace, traceTruncated: trace.length >= 180 };
  } finally {
    try {
      await runtime.runPythonAsync(
        "import sys, shutil\nif _lab_folder in sys.path:\n    sys.path.remove(_lab_folder)\nfor _module in _lab_module_names:\n    sys.modules.pop(_module, None)\nshutil.rmtree(_lab_folder, ignore_errors=True)",
        { globals: scope },
      );
    } catch {}
    inputValues.destroy();
    promptValues.destroy();
    moduleValues?.destroy();
    scope.destroy();
  }
}
self.onmessage = async ({ data }) => {
  try {
    if (data.type === "init") {
      importScripts("https://cdn.jsdelivr.net/pyodide/v0.27.7/full/pyodide.js");
      runtime = await loadPyodide({
        indexURL: "https://cdn.jsdelivr.net/pyodide/v0.27.7/full/",
      });
      self.postMessage({ type: "ready" });
      return;
    }
    if (!runtime) throw new Error("Python ยังไม่พร้อม");
    const primary = await execute(data.code, data.inputs, data.files, true);
    const checks = [];
    for (const test of data.tests || []) {
      try {
        const result = await execute(
          data.code + (test.append ? "\n" + test.append : ""),
          test.inputs || data.defaultInputs || [],
          data.files,
        );
        checks.push({
          name: test.name,
          pass: normalize(result.output) === normalize(test.expected),
          actual: result.output,
          expected: test.expected,
        });
      } catch (error) {
        checks.push({
          name: test.name,
          pass: false,
          error: String(error).split("\n").filter(Boolean).at(-1),
        });
      }
    }
    self.postMessage({ type: "result", id: data.id, ...primary, checks });
  } catch (error) {
    const raw = String(error);
    const index = raw.lastIndexOf('  File "main.py"');
    const message = index >= 0 ? "Python error:\n" + raw.slice(index) : raw;
    self.postMessage({ type: "error", id: data.id, message, trace: error.labTrace || [], output: error.labOutput || '', traceTruncated: (error.labTrace || []).length >= 180 });
  }
};
