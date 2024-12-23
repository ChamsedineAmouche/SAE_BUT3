import React from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const LocalisationSwal = ({ locations, onLocationSelect }) => {

  const handleOpenSwal = () => {
    const MySwal = withReactContent(Swal);

    MySwal.fire({
      title: "Choisir un emplacement",
      html: `
        <div>
          <label for="locationSelect" class="block text-m font-medium pb-2 text-darkGreen" >Emplacements disponibles :</label>
          <select id="locationSelect" class="swal2-input mt-2 block w-full px-3 py-2 border rounded-md shadow-sm bg-white focus:outline-none focus:ring-oliveGreen focus:border-oliveGreen">
            <option value="">Choisir un emplacement</option>
            ${locations
              .map(
                (location, index) =>
                  `<option value="${index}">${location.adress}, ${location.city} (${location.zipcode})</option>`
              )
              .join("")}
          </select>
        </div>

      `,
      showCancelButton: true,
      confirmButtonText: "Valider",
      cancelButtonText: "Annuler",
      customClass: {
        confirmButton: "px-4 py-2 bg-oliveGreen text-white rounded-md shadow hover:bg-yellowGreen1 mx-2",
        cancelButton: "px-4 py-2 border bg-white border-redd text-red rounded-md shadow hover:bg-rose-100 mx-2",
      },
      preConfirm: () => {
        const selectedIndex = document.getElementById("locationSelect").value;
        if (selectedIndex === "") {
          Swal.showValidationMessage("Vous devez choisir un emplacement");
        }
        return locations[selectedIndex];
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const selectedLocation = `${result.value.adress}, ${result.value.city} (${result.value.zipcode})`
        onLocationSelect(selectedLocation);
        Swal.fire({
          title: `Vous avez choisi l'emplacement :`,
          html: `${result.value.adress}, ${result.value.city} (${result.value.zipcode}) - Capacité: ${result.value.capacity}`,
          confirmButtonText: "Fermer",
          customClass: {
            confirmButton: "px-4 py-2 bg-oliveGreen text-white rounded-md shadow hover:bg-yellowGreen1 mx-2",
          },
        }
        );
      }
    });
  };

  return (
    <button
      type="button"
      className="mt-2 w-auto whitespace-nowrap px-4 py-2 bg-oliveGreen text-white rounded-md shadow hover:bg-yellowGreen1"
      onClick={handleOpenSwal}
    >
      Choisir un emplacement
    </button>
  );
};

export default LocalisationSwal;
