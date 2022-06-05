/* script.js */
//conventient failure messages
const Fs = ([cF, rF, uF, dF] = ["create", "read", "update", "delete"].map(
    (op) => `failed to ${op} idea[s]`
  ));
  
  /* wapi setup */
  const wapi = wapiInit("https://auth.web10.app");
  const sirs = [
    {
      service: "ideas",
      cross_origins: ["mamafleet.github.io", "localhost"],
      whitelist: [{ username: ".*", provider: ".*", read: true }],
  
    },
  ];
  wapi.SMROnReady(sirs, []);
  authButton.onclick = wapi.openAuthPortal;
  
  function initApp() {
    authButton.innerHTML = "log out";
    authButton.onclick = () => {
      wapi.signOut();
      window.location.reload();
    };
    const t = wapi.readToken();
    message.innerHTML = `hello ${t["provider"]}/${t["username"]},<br>`;
    readLines();
  }
  
  if (wapi.isSignedIn()) initApp();
  else wapi.authListen(initApp);
  
  /* CRUD Calls */
  function readLines() {
    wapi
      .read("ideas", {})
      .then((response) => displayTranslations(response.data))
      .catch(
        (error) => (message.innerHTML = `${rF} : ${error.response.data.detail}`)
      );
  }
  function createLine(book,idea,connections) {
    wapi
      .create("ideas", { book: book, idea: idea, connections: connections, date: String(new Date()) })
      .then(() => {
        readLines();
        curr.value = "";
      })
      .catch(
        (error) => (message.innerHTML = `${cF} : ${error.response.data.detail}`)
      );
  }
  function updateLine(id) {
    const book = String(document.getElementById("book"+id).value);
    const idea = String(document.getElementById("idea"+id).value);
    const connections = String(document.getElementById("connections"+id).value);
    wapi
      .update(
        "ideas",
        { _id: id },
        { $set: { book: book, idea: idea, connections: connections } }
      )
      .then(readLines)
      .catch(
        (error) => (message.innerHTML = `${uF} : ${error.response.data.detail}`)
      );
  }
  function deleteLine(id) {
    wapi
      .delete("ideas", { _id: id })
      .then(readLines)
      .catch(
        (error) => (message.innerHTML = `${dF} : ${error.response.data.detail}`)
      );
  }
  
  /* display */
  function displayTranslations(data) {
    function contain(line) {
      return `<div>
                  <p style="font-family:monospace;">${line.date}</p>
                  <p style="font-family:monospace;">${line._id}</p>
                  <textarea class = "textarea is-primary" id="book${line._id}">${line.book}</textarea>
                  <textarea class = "textarea is-info" id="idea${line._id}">${line.idea}</textarea>
                  <textarea class = "textarea is-info" id="connections${line._id}">${line.connections}</textarea>
                  <button id = "outer" class = "button_slide slide_left" onclick="updateLine('${line._id}')">Update</button>
                  <button id = "outer" class = "button_slide slide_left" onclick="deleteLine('${line._id}')">Delete</button>
              </div>`;
    }
    lineview.innerHTML = data.map(contain).reverse().join(`<br>`);
  }
  