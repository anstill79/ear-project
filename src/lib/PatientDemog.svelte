<div class="patient-info">
  <label for="Name">Name:</label>
  <input id="Name" type="text" />
  <label for="DOB">DOB:</label>
  <input id="DOB" type="date" />
  <label for="MRN">MRN:</label>
  <input id="MRN" type="text" class="right-align" />
</div>

<style>
  label {
    font-size: 1rem;
    align-self: start;
    color: gray;
  }
  input {
    font-size: 1.1rem;
  }

  .right-align {
    text-align: right;
  }
  .patient-info {
    display: grid;
    grid-template-columns: 80px 220px;
    align-items: end;
    gap: 5px;
    border: 1px solid #000000;
    border-radius: 10px;
    padding: 15px;
    width: 320px;
    margin-top: 20px;
    margin-bottom: 20px;
  }
  .patient-info > input {
    border-top: 0px;
    border-right: 0px;
    border-left: 0px;
    border-bottom: 1px solid black;
    padding-left: 10px;
    padding: 3px;
    /* border-left: 1px solid black; */
  }
</style>
