document.addEventListener('DOMContentLoaded', () => {

  const hogContainer = document.querySelector('#hog-container')
  const hogForm = document.querySelector('#hog-form')

    fetch('http://localhost:3000/hogs')
    .then(res => res.json())
    .then(res => addHogToPage(res))

    function addHogToPage(array) {
      array.forEach(function (hog) {
        if(hog.greased == true){
          answer = `checked="true"`
        }else{answer = 0}
        hogContainer.innerHTML += `<div id="div-${hog.id}" class="hog-card">
            <li>Name: ${hog.name}</li>
            <li>Speciality: ${hog.specialty}</li>
            <li>Greased?: ${hog.greased}</li>
            <input class="accept" name="accept" type="checkbox" value="2" ${answer}/>
            <li>Medal: ${hog["highest medal achieved"]}</li>
            <img src="${hog.image}" height="200px" width="200px"></li>
            <button id="del-${hog.id}">Delete</button>
        </div>`
      })
    }////// END ADD FUNCTION

    hogForm.addEventListener('submit', function (event) {
      event.preventDefault()

      console.log(event.target.children);

      let nameInput = event.target.children[0].value
      let specialtyInput = event.target.children[2].value
      let medalInput = event.target.children[4].value
      let imageInput = event.target.children[8].value
      let greasedInput = event.target.children[10].children[0].checked
      console.log(greasedInput);

      fetch('http://localhost:3000/hogs', {
        method: 'POST',
        headers:{'Accept': 'application/json',
        'Content-Type': 'application/json'},
        body: JSON.stringify({
          name: nameInput,
          specialty: specialtyInput,
          greased: greasedInput,
          "highest medal achieved":medalInput,
          image: imageInput
        })
      }).then(res => res.json()).then(res => addHogToPage([res]))




    })/////END SUBMIT

    hogContainer.addEventListener('click', function (event) {

      if(event.target.tagName==="BUTTON"){

        let specificId = event.target.id.split('-')[1]
        console.log(specificId);
      fetch(`http://localhost:3000/hogs/${specificId}`, {
        method: 'DELETE',
        headers: {'Accept': 'application/json',
        'Content-Type': 'application/json'}
      })

      let deleteDiv = document.querySelector(`#div-${specificId}`)
      deleteDiv.remove()

    }///// END IF

    })///// END addEventListener

    hogContainer.addEventListener('click', function (event) {
      if(event.target.className==='accept'){

        let greaseId = event.target.parentElement.id.split('-')[1]
        console.log(event.target.checked);

        if(event.target.checked == true){answer = true}else{answer = false}

        fetch(`http://localhost:3000/hogs/${greaseId}`,{
          method: 'PATCH',
          headers:{'Accept': 'application/json',
          'Content-Type': 'application/json'},
          body: JSON.stringify({
            greased: answer
          })
        }).then(res => res.json()).then(res => console.log(res))///// END FETCH




      }//// END IF
    })///// END GREASE EVENT





















})/////END DOM LOADED
