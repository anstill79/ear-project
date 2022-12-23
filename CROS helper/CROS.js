const inputs = {
  earToggle: '',
  setEar: () => {
    const rightText = document.getElementById('right_text');
    const leftText = document.getElementById('left_text');
    const setupEarText = document.getElementById('setup_ear');
    const image1 = document.getElementById('image_step_1');
    const image2 = document.getElementById('image_step_2');
    const scenarioText = document.getElementById('scenario_text');
    const placeholderText = document.getElementById('placeholder');

    scenarioText.style.display = "block";
    placeholderText.style.display = "none";

    //start w right deaf left normal
    if (inputs.earToggle === 'right' || !inputs.earToggle) {
      rightText.innerText = 'deaf (CROS)';
      leftText.innerText = 'normal (better)';
      setupEarText.innerText = 'Left';
      image1.style = 'transform: rotate(45deg);';
      image2.style = 'transform: rotate(-45deg);';
      targets.rightEars.forEach(function(element) {
        element.src = imageSrc.badEar;
      });
			      targets.leftEars.forEach(function(element) {
        element.src = imageSrc.goodEar;
      });
      inputs.earToggle = 'left'

    } else {
      rightText.innerText = 'normal (better)';
      leftText.innerText = 'deaf (CROS)';
      setupEarText.innerText = 'Right';
      image1.style = 'transform: rotate(-45deg);';
      image2.style = 'transform: rotate(45deg);';
			      targets.rightEars.forEach(function(element) {
        element.src = imageSrc.goodEar;
      });
			      targets.leftEars.forEach(function(element) {
        element.src = imageSrc.badEar;
      });
      inputs.earToggle = 'right'
    }
  }
}

const imageSrc = {
  head: "https://raw.githubusercontent.com/anstill79/ear-project/main/CROS%20helper/head.png",
  labelLeft: "https://raw.githubusercontent.com/anstill79/ear-project/main/CROS%20helper/labelLeft.png",
  labelRight: "https://raw.githubusercontent.com/anstill79/ear-project/main/CROS%20helper/labelRight.png",
  testScreen: "https://raw.githubusercontent.com/anstill79/ear-project/main/CROS%20helper/testScreen.png",
  goodEar: "https://raw.githubusercontent.com/anstill79/ear-project/main/CROS%20helper/goodEarSmall.png",
  badEar: "https://raw.githubusercontent.com/anstill79/ear-project/main/CROS%20helper/badEarSmall.png",
}


const targets = {
  rightEars: document.querySelectorAll('.rightEars'),
  leftEars: document.querySelectorAll('.leftEars'),
  head: document.getElementById('head')
}

targets.head.src = imageSrc.head;
