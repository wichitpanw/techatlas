import { mountScene as networkScene } from "./lab-scene.js";
import { mountScene as foundationScene } from "./foundation-scene.js";
import { conceptPreview } from "./network-concepts.js";

// Actual lesson renderers/data are the single source of truth for Explore previews.
export function mountScene(container, { lesson } = {}) {
  if (
    lesson.track === "network" &&
    lesson.section === "foundation" &&
    lesson.conceptLab
  ) {
    container.dataset.state = "0";
    container.dataset.value = "192";
    return foundationScene(container, { variant: lesson.id, preview: true });
  }
  if (lesson.track === "network" && !lesson.conceptLab) {
    const scene = networkScene(container, {
      variant: lesson.scene,
      preview: true,
    });
    if (lesson.id === "subnet") scene.setSubnet(24);
    return scene;
  }
  const surface = document.createElement("div");
  surface.className = "lesson-card-preview";
  surface.setAttribute("role", "img");
  surface.setAttribute("aria-label", `ภาพตัวอย่าง: ${lesson.title}`);
  if (lesson.track === "python") {
    const code = document.createElement("pre");
    code.textContent = lesson.starter;
    surface.append(code);
  } else surface.innerHTML = conceptPreview(lesson);
  container.append(surface);
  return {
    dispose() {
      surface.remove();
    },
  };
}
