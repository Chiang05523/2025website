import { db } from "./firebase.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

const container = document.querySelector("#works");

const snapshot = await getDocs(collection(db, "works"));

snapshot.forEach(doc => {
  const data = doc.data();

  container.innerHTML += `
    <div class="work-card">
      <img src="${data.image}">
      <h3>${data.title}</h3>
      <p>${data.description}</p>
    </div>
  `;
});
