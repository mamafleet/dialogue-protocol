/* script.js */
//conventient failure messages
const Fs = ([cF, rF, uF, dF] = ["create", "read", "update", "delete"].map(
    (op) => `failed to ${op} translation[s]`
  ));
  
  /* wapi setup */
  const wapi = wapiInit("https://auth.web10.app");
  const sirs = [
    {
      service: "translator",
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
      .read("translator", {})
      .then((response) => displayTranslations(response.data))
      .catch(
        (error) => (message.innerHTML = `${rF} : ${error.response.data.detail}`)
      );
  }
  function createLine(latin, english, links) {
    wapi
      .create("translator", { latin: latin, english: english, links: links, date: String(new Date()) })
      .then(() => {
        readLines();
        curr.value = "";
      })
      .catch(
        (error) => (message.innerHTML = `${cF} : ${error.response.data.detail}`)
      );
  }
  function updateLine(id) {
    const latin = String(document.getElementById("latin"+id).value);
    const english = String(document.getElementById("english"+id).value);
    const links = String(document.getElementById("links"+id).value);
    wapi
      .update(
        "translator",
        { _id: id },
        { $set: { english: english, latin: latin, links: links } }
      )
      .then(readLines)
      .catch(
        (error) => (message.innerHTML = `${uF} : ${error.response.data.detail}`)
      );
  }
  function deleteLine(id) {
    wapi
      .delete("translator", { _id: id })
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
                  <textarea class = "textarea is-primary" id="latin${line._id}">${line.latin}</textarea>
                  <textarea class = "textarea is-info" id="english${line._id}">${line.english}</textarea>
                  <textarea class = "textarea is-info" id="links${line._id}">${line.links}</textarea>
                  <button id = "outer" class = "button_slide slide_left" onclick="updateLine('${line._id}')">Update</button>
                  <button id = "outer" class = "button_slide slide_left" onclick="deleteLine('${line._id}')">Delete</button>
              </div>`;
    }
    lineview.innerHTML = data.map(contain).reverse().join(`<br>`);
  }
  