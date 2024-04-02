<script>
  export let title;
</script>

<header>
  <a href="/">{title}</a>
  <button popovertarget="menu-popover">Menu</button>
</header>
<div id="menu-popover" popover>
  <div id="menu-btn-wrapper">
    <button>SAL</button>
    <button>Audiogram</button>
    <button>CROS Helper</button>
  </div>
</div>

<style>
  * {
    box-sizing: border-box;

  }
  @media print {
    * {
      display: none;
    }
  }
  #menu-btn-wrapper {
    display: grid;
    gap: 5px;
    place-content: center;
    padding: 40px;
  }
  #menu-btn-wrapper > button {
    background-color: white;
    width: 130px;
    border: 1px solid black;
  }
  #menu-btn-wrapper > button:hover {
    border: 2px solid black;
    box-shadow: 2px 2px 2px;
  }
  #menu-popover {
    width: 80%;
    border: 1px solid black;
    width: 150px;
    border-radius: 7px;
  }
  #menu-popover::backdrop {
    background: rgb(0 0 0 / 60%);
  }
  #menu-popover > button {
    width: 50%;
    margin: auto;
  }

  button {
    cursor: pointer;
  }

  a {
    padding: 0px;
    padding-left: 15px;
    margin: 0px;
    color: White;
    font-size: 2rem;
    text-decoration: none;
  }
  a:hover {
    color: black;
  }
  header {
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: center;
    border: 1px solid black;
    /* border-radius: 7px; */
    box-shadow:
      2.1px 3.2px 12.5px rgba(0, 0, 0, 0.088),
      7.1px 10.7px 42px rgba(0, 0, 0, 0.129),
      32px 48px 188px rgba(0, 0, 0, 0.23);
    background-image: linear-gradient(15deg, #13547a 0%, #80d0c7 100%);
    max-width: 900px;
    margin: auto;
  }
  header > button {
    min-width: 100px;
    max-width: 200px;
    height: 80%;
    max-height: 40px;
    justify-self: end;
    margin-right: 1rem;
  }
</style>
