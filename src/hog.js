class Hog {
  constructor(hogObj) {
    this["id"]  = hogObj["id"]
    this["name"]  = hogObj["name"]
    this["specialty"] = hogObj["specialty"]
    this["greased"] = hogObj["greased"]
    this["weight as a ratio of hog to LG - 24.7 Cu. Ft. French Door Refrigerator with Thru-the-Door Ice and Water"] = hogObj["weight as a ratio of hog to LG - 24.7 Cu. Ft. French Door Refrigerator with Thru-the-Door Ice and Water"]
    this["highest medal achieved"] = hogObj["highest medal achieved"]
    this["image"] = hogObj["image"]

    Hog.all.push(this)
  }

  static find(id) {
    return this.all.find(hog => hog.id === id)
  }

  deleteHog() {
    return fetch(`http://localhost:3000/hogs/${this.id}`, { method: "DELETE"} )
      .then( () => {
        const deletedHog = hogContainer.querySelector(`.hog-card[data-id="${this.id}"]`)
        deletedHog.remove()
        Hog.all = Hog.all.filter(hog => hog.id !== this.id)
      })
  }

  renderFullHog() {
    const checkStatus = this.greased ? "checked" : ""
    return `
      <div class="hog-card" data-id="${this.id}">
        <h2>${this.name}</h2>
        <img src="${this.image}" alt="${this.name}">
        <h4>Specialty: ${this.specialty}</h4>
        <h4>Weight: ${this["weight as a ratio of hog to LG - 24.7 Cu. Ft. French Door Refrigerator with Thru-the-Door Ice and Water"]}</h4>
        <h4>Highest Medal: ${this["highest medal achieved"]}</h4>
        <label for="greased">Greased?</label>
        <input type="checkbox" name="greased" class="grease-check" data-id="${this.id}" data-greased="${this.greased}" ${checkStatus}>
        <button type="button" class="delete" data-id="${this.id}">Delete Hog</button>
      </div>
    `
  }

  renderInnerHog(hogCard) {
    const checkStatus = this.greased ? "checked" : ""
    hogCard.innerHTML = `
      <h2>${this.name}</h2>
      <img src="${this.image}" alt="${this.name}">
      <h4>Specialty: ${this.specialty}</h4>
      <h4>Weight: ${this["weight as a ratio of hog to LG - 24.7 Cu. Ft. French Door Refrigerator with Thru-the-Door Ice and Water"]}</h4>
      <h4>Highest Medal: ${this["highest medal achieved"]}</h4>
      <label for="greased">Greased?</label>
      <input type="checkbox" name="greased" class="grease-check" data-id="${this.id}" data-greased="${this.greased}" ${checkStatus}>
      <button type="button" data-id="${this.id}">Delete Hog</button>
    `
  }

  // action accepts true to grease hog, false to degrease hog
  hogGreaser(action) {
    console.log(action);
    return fetch(`http://localhost:3000/hogs/${this.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ greased: action })
    })
    .then(r => r.json())
    .then(hogData => {
      const updatedHogCard = hogContainer.querySelector(`.hog-card[data-id="${hogData.id}"]`)
      const oldHogIndex = Hog.all.findIndex(hog => hog.id === hogData.id)
      const oldInfo = Hog.all[oldHogIndex]
      Hog.all[oldHogIndex].greased = hogData.greased
      const updatedHog = Hog.find(hogData.id)
      updatedHog.renderInnerHog(updatedHogCard)
    })
  }
}

Hog.all = []
