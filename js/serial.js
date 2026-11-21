(() => {
  const byId = (id) => document.getElementById(id);
  const manuscript = byId("manuscript");
  const title = manuscript.elements.title;
  const story = manuscript.elements.story;
  const split = byId("split-story");
  const status = byId("serial-status");
  const workspace = byId("branches");
  const tree = byId("branch-tree");
  const editor = byId("branch-editor");
  const scene = editor.elements.scene;
  const instruction = editor.elements.instruction;
  const rewrite = byId("rewrite");
  const rewriteText = byId("rewrite-text");
  const editorStatus = byId("editor-status");
  const preview = byId("preview-rewrite");

  let draft;
  let selected;
  let timer;

  function reset() {
    clearTimeout(timer);
    draft = null;
    split.disabled = true;
    workspace.hidden = true;
    status.textContent = "원고를 등록하면 분기형으로 나눌 수 있어요.";
  }

  manuscript.addEventListener("input", reset);
  byId("load-sample").addEventListener("click", () => {
    reset();
    title.value = "새벽 세 시의 방송";
    story.value = "폐관한 도서관의 스피커에서 내 이름이 흘러나왔다. 방송실은 지하에 있었고, 정문 옆 비상구에는 밖으로 이어지는 계단이 있었다. 어느 쪽으로 갈지 정하기 전에 방송이 한 번 더 울렸다.";
    title.focus();
  });

  manuscript.addEventListener("submit", (event) => {
    event.preventDefault();
    reset();
    if (!title.value.trim() || !story.value.trim()) {
      status.textContent = "제목과 원고를 입력해 주세요.";
      return;
    }
    draft = { title: title.value.trim(), story: story.value.trim() };
    split.disabled = false;
    status.textContent = "원고를 등록했어요. 분기형으로 나누기를 눌러보세요.";
  });

  function selectBranch(branch, button) {
    selected = branch;
    tree.querySelector('[aria-pressed="true"]')?.setAttribute("aria-pressed", "false");
    button.setAttribute("aria-pressed", "true");
    editor.hidden = false;
    byId("branch-heading").textContent = branch.label;
    scene.value = branch.text;
    instruction.value = "";
    rewrite.hidden = true;
    editorStatus.textContent = "";
  }

  function makeTree(branches) {
    const list = document.createElement("ul");
    list.className = "serial-tree";
    for (const branch of branches) {
      const item = document.createElement("li");
      const button = document.createElement("button");
      button.type = "button";
      button.className = "terminal-button serial-node";
      button.textContent = branch.label;
      button.setAttribute("aria-pressed", "false");
      button.addEventListener("click", () => selectBranch(branch, button));
      item.append(button);
      if (branch.children) item.append(makeTree(branch.children));
      list.append(item);
    }
    return list;
  }

  split.addEventListener("click", () => {
    split.disabled = true;
    status.textContent = "원고에서 선택 지점을 찾는 중… (데모)";
    timer = setTimeout(() => {
      const structure = [{
        label: draft.title,
        text: draft.story,
        children: [
          { label: "A · 단서를 따라간다", text: "주인공은 남은 흔적을 따라가기로 했다. 걸음을 옮길 때마다 조금 전까지 들리던 소리가 멀어졌다.",
            children: [{ label: "엔딩 A · 발견", text: "흔적의 끝에서 주인공은 그동안 놓쳤던 단서를 발견했다." }] },
          { label: "B · 다른 길을 찾는다", text: "주인공은 발길을 돌렸다. 멀리 희미한 불빛이 보였지만 그곳까지 이어지는 길은 처음 보는 길이었다.",
            children: [{ label: "엔딩 B · 귀환", text: "새로운 길은 뜻밖에도 이 이야기의 시작점으로 이어졌다." }] },
        ],
      }];
      editor.hidden = true;
      tree.replaceChildren(makeTree(structure));
      workspace.hidden = false;
      status.textContent = "등록한 원고에 예시 선택지 2개와 엔딩 2개를 연결했어요.";
      tree.querySelector("button").focus();
    }, 550);
  });

  scene.addEventListener("input", () => {
    rewrite.hidden = true;
    editorStatus.textContent = "";
  });
  instruction.addEventListener("input", () => { rewrite.hidden = true; });
  editor.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!scene.value.trim()) {
      editorStatus.textContent = "장면 내용을 입력해 주세요.";
      return;
    }
    selected.text = scene.value.trim();
    rewrite.hidden = true;
    editorStatus.textContent = "이 분기의 장면을 수정했어요.";
  });
  preview.addEventListener("click", () => {
    const direction = instruction.value.trim();
    if (!direction || !scene.value.trim()) {
      editorStatus.textContent = "장면 내용과 수정 지시를 입력해 주세요.";
      return;
    }
    const addition = /짧|간결|요약/.test(direction)
      ? ""
      : /대화|대사/.test(direction)
        ? "\n\n“잠깐. 방금 그 소리, 너도 들었어?”"
        : "\n\n숨을 고르는 사이, 가까운 곳에서 바닥이 한 번 삐걱거렸다.";
    rewriteText.textContent = addition
      ? scene.value.trim() + addition
      : scene.value.trim().split(/(?<=[.!?。])\s+/)[0].slice(0, 120);
    byId("rewrite-direction").textContent = `수정 지시 · ${direction}`;
    rewrite.hidden = false;
    editorStatus.textContent = "AI 수정 예시를 확인하고 적용할 수 있어요.";
  });
  byId("apply-rewrite").addEventListener("click", () => {
    selected.text = rewriteText.textContent;
    scene.value = selected.text;
    rewrite.hidden = true;
    editorStatus.textContent = "수정 예시를 선택한 분기에 적용했어요.";
    scene.focus();
  });
})();
