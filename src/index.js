document.addEventListener('DOMContentLoaded', function() {

  const hogsURL = `http://localhost:3000/hogs/`
  const weightKey = 'weight as a ratio of hog to LG - 24.7 Cu. Ft. French Door Refrigerator with Thru-the-Door Ice and Water'
  const medalKey = 'highest medal achieved'
  const hogContainer = document.getElementById('hog-container')
  const hogForm = document.getElementById('hog-form')
  let allHogs = []

  const fetchHogs = () => {
    fetch(hogsURL)
      .then(response => response.json())
      .then(data => {
        showHogs(data)
        allHogs = data
      })
  }

  const showHogs = (hogs) => {
    hogContainer.innerHTML = ''
    hogs.forEach(hog => {
      let greased
      if (hog.greased) {
        greased = 'checked'
      } else {
        greased = ''
      }
      hogContainer.innerHTML += `
        <div class='hog-card'>
          <h3>${hog.name}</h3>
          <img src='${hog.image}'>
          <p>Specialty: ${hog.specialty}</p>
          <p>Medal: ${hog[medalKey]}</p>
          <p>Weight: ${hog[weightKey]}</p>
          Greased: <input data-id='${hog.id}' type='checkbox' name='greased' ${greased}><br><br>
          <button data-id='${hog.id}'>🥓</button>
        </div>
      `
    })
  }

  hogForm.addEventListener('submit', (event) => {
    event.preventDefault()
    let name = document.querySelector("input[name='name']").value
    let specialty = document.querySelector("input[name='specialty']").value
    let medal = document.querySelector("input[name='medal']").value
    let weight = document.querySelector("input[name='weight']").value
    let img_url = document.querySelector("input[name='img']").value
    let greased = document.querySelector("input[name='greased']").checked
    fetch(hogsURL, {
      method: 'POST',
      headers: {
        'Content-Type' : 'application/json',
        'Accept' : 'application/json'
      },
      body: JSON.stringify({
        "name": name,
        "specialty": specialty,
        "greased": greased,
        "weight as a ratio of hog to LG - 24.7 Cu. Ft. French Door Refrigerator with Thru-the-Door Ice and Water": weight,
        "highest medal achieved": medal,
        "image": img_url
      })
    })
    .then(fetchHogs)
  })

  const findHog = (event) => {
    let foundHog = allHogs.find(hog => {
      return hog.id == event.target.dataset.id
    })
    return foundHog
  }

  const deleteHog = (hog) => {
    fetch(hogsURL + hog.id, {
      method: 'DELETE'
    })
  }

  const greaseHog = (hog) => {
    let greased = !hog.greased
    fetch((hogsURL + hog.id), {
      method: 'PATCH',
      headers: {
        'Content-Type' : 'application/json',
        'Accept' : 'application/json'
      },
      body: JSON.stringify({
        greased: greased
      })
    })
    .then(fetchHogs)
  }

  hogContainer.addEventListener('click', (event) => {
    if (event.target.tagName === 'BUTTON') {
      let foundHog = findHog(event)
      event.target.parentNode.remove()
      deleteHog(foundHog)
    }
  })

  hogContainer.addEventListener('change', (event) => {
    let foundHog = findHog(event)
    greaseHog(foundHog)
  })

  fetchHogs()
})
