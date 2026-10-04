// Classic worker helper. Capture real CPython trace events, never infer execution from source.
self.PYTHON_TRACE_SETUP = `
import sys as _lab_sys, json as _lab_json, builtins as _lab_builtins
_lab_trace_count = 0
_lab_objects = {}
_lab_object_refs = []
def _lab_value(value):
    kind = type(value).__name__
    if type(value) in (str, int, float, bool, type(None)):
        text = repr(value)[:160]
    elif type(value) in (list, tuple, set, dict):
        text = repr(value)[:160]
    else:
        text = '<' + kind + '>'
    result = {'type': kind, 'value': text}
    if type(value) in (list, tuple, set, dict):
        identity = _lab_builtins.id(value)
        if identity not in _lab_objects:
            _lab_objects[identity] = 'object ' + str(len(_lab_objects) + 1)
            _lab_object_refs.append(value)
        result['objectId'] = _lab_objects[identity]
    if type(value) in (list, tuple, set, dict, str):
        result['length'] = len(value)
        entries = []
        if type(value) is dict:
            for key, item in list(value.items())[:8]:
                entries.append({'key': repr(key)[:40], 'value': _lab_short(item)})
        else:
            for index, item in enumerate(list(value)[:8]):
                entries.append({'key': '' if type(value) is set else str(index), 'value': _lab_short(item)})
        result['items'] = entries
    return result
def _lab_short(value):
    if type(value) in (str, int, float, bool, type(None), list, tuple, set, dict):
        return repr(value)[:80]
    return '<' + type(value).__name__ + '>'
def _lab_vars(values):
    result = []
    for name, value in list(values.items()):
        if name.startswith('_lab_') or name in ('input', '__builtins__', '__name__', '__doc__', '__package__', '__loader__', '__spec__', '__file__', '__cached__'):
            continue
        result.append({'name': name, **_lab_value(value)})
        if len(result) >= 12:
            break
    return result
def _lab_user_frame(frame):
    filename = frame.f_code.co_filename
    return (filename == 'main.py' or filename.startswith(_lab_folder + '/')) and frame.f_code.co_name != 'input'
def _lab_trace(frame, event, arg):
    global _lab_trace_count
    if not _lab_user_frame(frame):
        return None
    if event not in ('line', 'call', 'return', 'exception'):
        return _lab_trace
    if _lab_trace_count >= 180:
        return _lab_trace
    _lab_trace_count += 1
    stack = []
    parent = frame
    while parent:
        if _lab_user_frame(parent):
            stack.append({'name': parent.f_code.co_name, 'file': parent.f_code.co_filename.rsplit('/', 1)[-1]})
        parent = parent.f_back
    record = {'event': event, 'line': frame.f_lineno, 'file': frame.f_code.co_filename.rsplit('/', 1)[-1], 'function': frame.f_code.co_name, 'variables': _lab_vars(frame.f_locals), 'globals': _lab_vars(frame.f_globals), 'stack': list(reversed(stack))}
    if event == 'return':
        record['returned'] = _lab_short(arg)
    if event == 'exception':
        record['exception'] = arg[0].__name__ + ': ' + str(arg[1])[:160]
    _lab_trace_emit(_lab_json.dumps(record, ensure_ascii=False))
    return _lab_trace
_lab_sys.settrace(_lab_trace)
`;
