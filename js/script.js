"use strict";

window.addEventListener("load", initialise);

let characters = [];
let houses = [];
let bloodlines = [];
let online = false;

async function initialise() {
	// dom elementen ophalen
	let housesSelect = document.getElementById("houses");
	let radioButtons = document.querySelectorAll("input[name=ancestry]");
	console.log(radioButtons);
	let button = document.getElementById("get-data-online");

	//eventlistener toevoegen
	button.addEventListener("click", toggleData);
	housesSelect.addEventListener("change", showCharacters);

	// functies uitvoeren
	if (online) {
		characters = await getOnlineCharacters();
		button.innerHTML = "Get Offline Data";
	} else {
		getOfflineCharacters();
		button.innerHTML = "Get Online Data";
	}
	showHouses();
	showAncestry();
	showCharacters();
}

// data ophalen
function getOfflineCharacters() {
	characters = potterCharacters;
}

// data ophalen uit api
async function getOnlineCharacters() {
	try {
		let response = await fetch("https://hp-api.onrender.com/api/characters");
		if (response.ok) {
			let data = await response.json();
			return data;
		} else {
			throw new Error("Something went wrong");
		}
	} catch (error) {
		console.log(error);
		return [];
	}
}

// wisselen tussen offline en online data met de button "get-data-online"
function getCharacters() {
	//functie uitvoeren
	getOfflineCharacters();
}

function toggleData() {
	let button = document.getElementById("get-data-online");
	characters = [];

	online = !online;
	initialise();
}

// houses ophalen
function getHouses() {
	houses = [];
	characters.forEach((character) => {
		if (!houses.includes(character.house)) {
			houses.push(character.house);
		}
	});
}

// houses weergeven
function showHouses() {
	getHouses();
	let housesSelect = document.getElementById("houses");
	housesSelect.innerHTML = "";
	// all toevoegen
	let option = document.createElement("option");
	option.value = "all";
	option.innerHTML = "All";
	housesSelect.appendChild(option);
	// overige toevoegen
	for (let i = 0; i < houses.length; i++) {
		let option = document.createElement("option");
		option.value = houses[i];
		option.innerHTML = houses[i] === "" ? "Unknown" : houses[i];
		housesSelect.appendChild(option);
	}
}

// anchestry ophalen
function getAncestry() {
	bloodlines = [];
	characters.forEach((character) => {
		if (!bloodlines.includes(character.ancestry)) {
			bloodlines.push(character.ancestry);
		}
	});
}

// anchestry weergeven
function showAncestry() {
	getAncestry();
	let ancestryDiv = document.getElementById("ancestry");
	ancestryDiv.innerHTML = "Ancestry: ";
	// all toevoegen
	let input = document.createElement("input");
	let label = document.createElement("label");
	input.type = "radio";
	input.name = "ancestry";
	input.id = "all";
	input.value = "all";
	input.checked = true;
	label.setAttribute("for", "all");
	label.innerHTML = "all";
	ancestryDiv.appendChild(input);
	ancestryDiv.appendChild(label);
	// overige toevoegen
	for (let i = 0; i < bloodlines.length; i++) {
		let input = document.createElement("input");
		let label = document.createElement("label");
		input.type = "radio";
		input.name = "ancestry";
		input.id = bloodlines[i] === "" ? "unknown" : bloodlines[i];
		input.value = bloodlines[i];
		label.setAttribute("for", bloodlines[i] === "" ? "unknown" : bloodlines[i]);
		label.innerHTML = bloodlines[i] === "" ? "unknown" : bloodlines[i];
		ancestryDiv.appendChild(input);
		ancestryDiv.appendChild(label);
		input.addEventListener("change", showCharacters);
	}
}

// characters weergeven op basis van house en anchestry
function showCharacters() {
	let house = document.getElementById("houses").value;
	let ancestry = document.querySelector("input[name='ancestry']:checked").value;
	let charactersDiv = document.getElementById("characters");
	charactersDiv.innerHTML = "";
	// filteren
	let filteredCharacters = characters.filter((character) => {
		const houseFilter = house === "all" || character.house === house;
		const ancestryFilter = ancestry === "all" || character.ancestry === ancestry;
		return houseFilter && ancestryFilter;
	});
	// weergeven
	if (filteredCharacters.length === 0) {
		let message = document.createElement("p");
		message.innerHTML = "No characters found";
		charactersDiv.appendChild(message);
	} else {
		filteredCharacters.forEach((character) => {
			let characterDiv = document.createElement("div");
			let img = document.createElement("img");
			let name = document.createElement("p");
			let actor = document.createElement("p");
			if (character.hogwartsStudent == true && character.hogwartsStaff == false) {
				character.status = "student";
			} else if (character.hogwartsStaff == true && character.hogwartsStudent == false) {
				character.status = "staff";
			} else if (character.hogwartsStaff == true && character.hogwartsStudent == true) {
				character.status = "student & staff";
			} else {
				character.status = "neither student nor staff";
			}
			if (character.wizard == true) {
				character.wizard = "a wizard";
			} else {
				character.wizard = "not a wizard";
			}
			characterDiv.title = character.name + " is " + character.wizard + " and is " + character.status + " at hogwarts.";
			characterDiv.id = character.name;
			characterDiv.classList.add("character");
			if (character.house === "Gryffindor") {
				characterDiv.classList.add("gryffindor");
			} else if (character.house === "Slytherin") {
				characterDiv.classList.add("slytherin");
			} else if (character.house === "Hufflepuff") {
				characterDiv.classList.add("hufflepuff");
			} else if (character.house === "Ravenclaw") {
				characterDiv.classList.add("ravenclaw");
			} else {
				characterDiv.classList.add("noHouse");
			}
			if (character.image === "") {
				img.src = "img/No_Image_Available.jpg";
			} else {
				img.src = character.image;
			}
			name.innerHTML = character.name;
			actor.innerHTML = "<p class='acteur'>" + character.actor + "</p>";
			characterDiv.appendChild(img);
			characterDiv.appendChild(name);
			characterDiv.appendChild(actor);
			charactersDiv.appendChild(characterDiv);
		});
	}
}

/*

## Extra's
Voorzie een paginering onderaan de pagina in functie van het aantal characters. Is het aantal karakters groter dan 12 dan wordt er paginatie voorzien en worden slechts de eerste 12 karakters getoond. Bij aanklikken van een andere pagina worden enkel de karakters getoond die zich op deze pagina bevinden.

Indien minder dan 12 karakters getoond worden bij filtering verdwijnt de paginatie.


*/
