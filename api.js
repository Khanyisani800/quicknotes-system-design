const API_URL = "https://jsonplaceholder.typicode.com/posts";

const loadBtn = document.getElementById("load-btn");
const submitBtn = document.getElementById("submit-btn");
const statusP = document.getElementById("status");
const noteForm = document.getElementById("note-form");
const titleInput = document.getElementById("title-input");
const bodyInput = document.getElementById("body-input");
const notesList = document.getElementById("notes-list");

function setStatus(message, type) {
  statusP.textContent = message;
  statusP.className = "";
  if (type) {
    statusP.classList.add(`status-${type}`);
  }
}

function setButtonsDisabled(isDisabled) {
  loadBtn.disabled = isDisabled;
  submitBtn.disabled = isDisabled;
  const deleteButtons = document.querySelectorAll(".delete-btn");
  deleteButtons.forEach(btn => btn.disabled = isDisabled);
}

async function request(url, options = {}) {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`HTTP Error! Status: ${response.status}`);
  }
  if (response.status === 204 || options.method === "DELETE") {
    return true;
  }
  return await response.json();
}

async function loadNotes() {
  setStatus("Loading notes...", "loading");
  setButtonsDisabled(true);

  try {
    const data = await request(`${API_URL}?_limit=10`);
    notesList.innerHTML = "";

    if (!data || data.length === 0) {
      setStatus("No notes found.", "empty");
      const emptyLi = document.createElement("li");
      emptyLi.className = "empty-state";
      emptyLi.textContent = "No notes available to display.";
      notesList.appendChild(emptyLi);
      return;
    }

    data.forEach(note => {
      renderNoteItem(note, false);
    });

    setStatus("Loaded 10 notes from the server.", "success");
  } catch (error) {
    console.error("GET Error:", error);
    setStatus("Failed to load notes. Please try again.", "error");
  } finally {
    setButtonsDisabled(false);
  }
}

async function createNote(event) {
  event.preventDefault();

  const title = titleInput.value.trim();
  const body = bodyInput.value.trim();

  if (!title) {
    setStatus("Validation error: Title is required.", "error");
    return;
  }
  if (title.length > 100) {
    setStatus("Validation error: Title must be 100 characters or less.", "error");
    return;
  }

  setStatus("Creating note...", "loading");
  setButtonsDisabled(true);

  try {
    const newNoteData = {
      title: title,
      body: body,
      userId: 1
    };

    const createdNote = await request(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newNoteData)
    });

    renderNoteItem(createdNote, true);
    setStatus(`Note created (status 201, id ${createdNote.id}).`, "success");
    noteForm.reset();
  } catch (error) {
    console.error("POST Error:", error);
    setStatus("Failed to create note. Please try again.", "error");
  } finally {
    setButtonsDisabled(false);
  }
}

async function deleteNote(id, listItemElement) {
  /*
   * Note: JSONPlaceholder is a mock API. Calling DELETE /posts/{id} returns success,
   * but the item is not actually removed from JSONPlaceholder's remote database.
   * We remove the DOM element locally to ensure smooth client-side UX.
   */
  setStatus(`Deleting note #${id}...`, "loading");
  setButtonsDisabled(true);

  try {
    await request(`${API_URL}/${id}`, {
      method: "DELETE"
    });

    listItemElement.remove();
    setStatus(`Note #${id} successfully deleted.`, "success");

    if (notesList.children.length === 0) {
      const emptyLi = document.createElement("li");
      emptyLi.className = "empty-state";
      emptyLi.textContent = "No notes available to display.";
      notesList.appendChild(emptyLi);
    }
  } catch (error) {
    console.error("DELETE Error:", error);
    setStatus(`Failed to delete note #${id}. Please try again.`, "error");
  } finally {
    setButtonsDisabled(false);
  }
}

function renderNoteItem(note, prepend = false) {
  const emptyMessage = notesList.querySelector(".empty-state");
  if (emptyMessage) {
    emptyMessage.remove();
  }

  const li = document.createElement("li");
  li.className = "note-item";

  const h3 = document.createElement("h3");
  h3.textContent = note.title;

  const p = document.createElement("p");
  p.textContent = note.body || "No body content.";

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "delete-btn";
  deleteBtn.textContent = "Delete Note";
  deleteBtn.addEventListener("click", () => deleteNote(note.id, li));

  li.appendChild(h3);
  li.appendChild(p);
  li.appendChild(deleteBtn);

  if (prepend) {
    notesList.prepend(li);
  } else {
    notesList.appendChild(li);
  }
}

loadBtn.addEventListener("click", loadNotes);
noteForm.addEventListener("submit", createNote);
