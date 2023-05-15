// Copyright 2023 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// A generic onclick callback function.
chrome.contextMenus.onClicked.addListener(genericOnClick);
function injectedFunction() {
  document.body.style.backgroundColor = "orange";
  const socket = io('http://localhost:' + 8002, {auth: {token: 'my-token'}});

  // var socket = io.connect('http://localhost:8002', {
  //   path: '/',
  //   transports:['websocket'],
  //   serveClient: true,
  //   secure: false
  // });

  const port = 8002;

// const socket = io('http://localhost:' + port, {path:'abcd/'});
console.log("🚀 ~ file: background.js:31 ~ injectedFunction ~ socket:", socket)
// socket.connect();
let last;
function send () {
  last = new Date();
  socket.emit('ping_from_client');
}

socket.on('connect', () => {
  console.log(`connect ${socket.id}`);
  send();
});

socket.on('disconnect', () => {
  console.log(`disconnect ${socket.id}`);
});

socket.on('pong_from_server', () => {
  const latency = new Date() - last;
  console.log('latency is ' + latency + ' ms');
  setTimeout(send, 1000);
});
}

function injectedFunction2(content, type) {
  var myHeaders = new Headers();
  myHeaders.append("Bearer", "Toka @m9b*");

  var formdata = new FormData();
  formdata.append("content", content);
  formdata.append("type", type);

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: formdata,
    redirect: 'follow'
  };
}

function injectedFunction3() {
  
}

function handleSelection(content, type) {
  
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", "<your token>");

  const body = JSON.stringify({
    'content': content,
    'type': type
  });
  var raw = JSON.stringify([
    "PUBLISH",
    "hollow",
    body,

  ]);

var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};

fetch("https://host.com", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));
}
function handleClick(type, tab) {
  // chrome.scripting.executeScript({
  //   target : {tabId : tab.id},
  //   func : injectedFunction2,
  //   args : [content, type]
  // });
  // chrome.scripting.executeScript({target: {tabId: tab.id}, files: ["socket.js"] })
  // .then(() => {
  //   chrome.scripting.executeScript({
  //     target : {tabId : tab.id},
  //     func : injectedFunction,
  //   });
  // });
}

// A generic onclick callback function.
function genericOnClick(info, tab) {
    
    console.log(info.selectionText, info.menuItemId, );
    
    console.log(JSON.stringify(info));
  switch (info.menuItemId) {
    case 'radio':
      // Radio item function
      console.log('Radio item clicked. Status:', info.checked);
      break;
    case 'checkbox':
      // Checkbox item function
      console.log('Checkbox item clicked. Status:', info.checked);
      break;
    case 'page':
    case 'link':
      
      // chrome.tabs.create({ url: info.pageUrl , index: tab.index + 1 });
      handleSelection(info.pageUrl, 'page');
      break;
    case 'selection':
      handleSelection(info.selectionText, info.menuItemId);
      break;
    case 'image':
      
      if(info.srcUrl.includes('data:')){        
        const b64 = info.srcUrl.replace("data:", "")
        .replace(/^.+,/, "");
        handleSelection(b64, 'image');
      } else {
        handleSelection(info.srcUrl, 'page');
      }
      break;
    // case 'page','image', 'selection':
      
    //   handleClick(info, tab);
    //   break;
        // chrome.tabs.create({ url: info.pageUrl, index: tab.index + 1 });
    default:
      // Standard context menu item function
      console.log('Standard context menu item clicked.');
  }
}
chrome.runtime.onInstalled.addListener(function () {
  // Create one test item for each context type.
  let contexts = [
    'page',
    'selection',
    'link',
    // 'editable',
    'image',
    // 'video',
    // 'audio'
  ];
  for (let i = 0; i < contexts.length; i++) {
    let context = contexts[i];
    let title = "Ping to device, on '" + context + "' menu item";
    let id = chrome.contextMenus.create({
      title: title,
      contexts: [context],
      id: context
    });
  }

  // Create a parent item and two children.
  // let parent = chrome.contextMenus.create({
  //   title: 'Test parent item',
  //   id: 'parent'
  // });
  // let child1 = chrome.contextMenus.create({
  //   title: 'Child 1',
  //   parentId: parent,
  //   id: 'child1'
  // });
  // let child2 = chrome.contextMenus.create({
  //   title: 'Child 2',
  //   parentId: parent,
  //   id: 'child2'
  // });

  // // Create a radio item.
  // let radio1 = chrome.contextMenus.create({
  //   title: 'radio',
  //   type: 'radio',
  //   id: 'radio'
  // });

  // // Create a checkbox item.
  // let checkbox1 = chrome.contextMenus.create({
  //   title: 'checkbox',
  //   type: 'checkbox',
  //   id: 'checkbox'
  // });

  // Intentionally create an invalid item, to show off error checking in the
  // create callback.
  chrome.contextMenus.create(
    { title: 'Oops', parentId: 999, id: 'errorItem' },
    function () {
      if (chrome.runtime.lastError) {
        console.log('Got expected error: ' + chrome.runtime.lastError.message);
      }
    }
  );
});