document.addEventListener("DOMContentLoaded", () => {
  const hogForm = document.getElementById("hog-form")
  const hogContainer = document.getElementById("hog-container")

  function fetchHogs() {
    fetch("http://localhost:3000/hogs")
    .then(r => r.json())
    .then(data => {
      data.forEach(hog => {
        hogContainer.innerHTML += renderHog(hog)
      })
    })
  }

  hogContainer.addEventListener("click", e => {
    if (e.target.className === "grease-check") {
      if (e.target.dataset.greased === "true") {
        hogGreaser(e.target.dataset.id, false)
      } else {
        hogGreaser(e.target.dataset.id, true)
      }
    } else if (e.target.className === "delete") {
      deleteHog(e.target.dataset.id)
    }
  })

  hogForm.addEventListener("submit", e => {
    e.preventDefault()

    const newName = hogForm.querySelector("input[name='name']")
    const newSpecialty = hogForm.querySelector("input[name='specialty']")
    const newMedal = hogForm.querySelector("input[name='medal']")
    const newWeight = hogForm.querySelector("input[name='weight']")
    const newImg = hogForm.querySelector("input[name='img']")
    const newGreased = hogForm.querySelector("input[name='greased']")

    fetch("http://localhost:3000/hogs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        "name": newName.value,
        "specialty": newSpecialty.value,
        "greased": newGreased.checked,
        "weight as a ratio of hog to LG - 24.7 Cu. Ft. French Door Refrigerator with Thru-the-Door Ice and Water": newWeight.value,
        "highest medal achieved": newMedal.value,
        "image": newImg.value,
      })
    })
    .then(r => r.json())
    .then(data => {
      hogContainer.innerHTML += renderHog(data)
      hogForm.reset()
    })
  })

  function renderHog(hog) {
    const checkStatus = hog.greased ? "checked" : ""
    return `
      <div class="hog-card" data-id="${hog.id}">
        <h2>${hog.name}</h2>
        <img src="${hog.image}" alt="${hog.name}">
        <h4>Specialty: ${hog.specialty}</h4>
        <h4>Weight: ${hog["weight as a ratio of hog to LG - 24.7 Cu. Ft. French Door Refrigerator with Thru-the-Door Ice and Water"]}</h4>
        <h4>Highest Medal: ${hog["highest medal achieved"]}</h4>
        <label for="greased">Greased?</label>
        <input type="checkbox" name="greased" class="grease-check" data-id="${hog.id}" data-greased="${hog.greased}" ${checkStatus}>
        <button type="button" class="delete" data-id="${hog.id}">Delete Hog</button>
      </div>
    `
  }

  // action accepts true to grease hog, false to degrease hog
  function hogGreaser(id, action) {
    return fetch(`http://localhost:3000/hogs/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ greased: action })
    })
    .then(r => r.json())
    .then(hog => {
      const updatedHog = hogContainer.querySelector(`.hog-card[data-id="${hog.id}"]`)
      const checkStatus = hog.greased ? "checked" : ""
      updatedHog.innerHTML = `
        <h2>${hog.name}</h2>
        <img src="${hog.image}" alt="${hog.name}">
        <h4>Specialty: ${hog.specialty}</h4>
        <h4>Weight: ${hog["weight as a ratio of hog to LG - 24.7 Cu. Ft. French Door Refrigerator with Thru-the-Door Ice and Water"]}</h4>
        <h4>Highest Medal: ${hog["highest medal achieved"]}</h4>
        <label for="greased">Greased?</label>
        <input type="checkbox" name="greased" class="grease-check" data-id="${hog.id}" data-greased="${hog.greased}" ${checkStatus}>
        <button type="button" data-id="${hog.id}">Delete Hog</button>
      `
    })
  }

  function deleteHog(id) {
    return fetch(`http://localhost:3000/hogs/${id}`, { method: "DELETE"} )
      .then( () => {
        const deletedHog = hogContainer.querySelector(`.hog-card[data-id="${id}"]`)
        deletedHog.remove()
      })
  }



  fetchHogs()
})
