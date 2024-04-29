<script>
  export let sectionName = "Audiogram";
</script>

<div id="sub_section">
  <span>{sectionName}</span>
</div>

<style>
  #sub_section {
    display: grid;
    place-content: center;
    border: 1px solid black;
    max-width: 900px;
    margin: auto;
    margin-top: 20px;
    background-color: white;
    padding-block:3px;
  }
  span {
    font-size: 1.5em;
    font-family: Arial, Helvetica, sans-serif;
  }

    @media print {
    * {
      display: none;
    }
  }
</style>
