var API_KEY = configKeys.API_KEY;

// add ratings on hover for each show item
function addEvents() {
  let showBlocks = document.querySelectorAll(
    ".slider .showPeek .slider-item:not(.net-mod)"
  );
  showBlocks.forEach(showBlock => {
    showBlock.addEventListener("mouseenter", () => {
      if (!showBlock.querySelector(".net-mod-rating-wrapper")) {
        // get show title
        let elemTitle = showBlock
          .querySelector(".fallback-text")
          .textContent.trim();

        const url = `https://www.omdbapi.com/?apikey=${API_KEY}&t=${elemTitle}`;
        fetch(url)
          .then(resp => resp.json())
          .then(function(data) {
            var ratingsWrapper = document.createElement("span");
            ratingsWrapper.classList.add("net-mod-rating-wrapper");
            let ratings = data.Ratings;
            // console.log("Ratings", data);
            ratings &&
              ratings.forEach(rating => {
                // add rating block
                let newEl = document.createElement("span");
                let source = rating.Source;
                newEl.innerHTML = rating.Value;
                newEl.classList.add("net-mod-rating");
                if (source === "Internet Movie Database") {
                  newEl.classList.add("imdb");
                } else if (source === "Rotten Tomatoes") {
                  newEl.classList.add("tomatoes");
                }
                ratingsWrapper.appendChild(newEl);
              });

            var ifTitleExist = setInterval(() => {
              var thisTitleBlock = showBlock.querySelector(".bob-title");
              if (
                typeof thisTitleBlock != "undefined" &&
                thisTitleBlock != null
              ) {
                showBlock
                  .querySelector(".bob-title")
                  .parentNode.insertBefore(
                    ratingsWrapper,
                    thisTitleBlock.nextSibling
                  );
                clearInterval(ifTitleExist);
              }
            }, 200);
            setTimeout(() => {
              clearInterval(ifTitleExist);
            }, 2000);
          })
          .catch(function(error) {
            console.log(error);
          });
      }
    });
    // add mod class
    showBlock.classList.add("net-mod");
  });
}

// on prev/next arrow clicks
function prevNextBtnEvents() {
  document
    .querySelectorAll(".slider .handle:not(.net-prev-next)")
    .forEach(item => {
      item.classList.add("net-prev-next");
      item.addEventListener("mousedown", event => {
        setTimeout(function() {
          addEvents();
          prevNextBtnEvents();
        }, 1000);
      });
    });
}

prevNextBtnEvents();

// for page scrolling & search bar updates
const targetNode = document.querySelector("body");
const config = {
  attributes: true,
  childList: false,
  subtree: false,
  characterData: true
};

const callback = function(mutationsList, observer) {
  // console.log("MAIN mutation", mutationsList);
  setTimeout(function() {
    addEvents();
    prevNextBtnEvents();
  }, 1000);
};

const observer = new MutationObserver(callback);
observer.observe(targetNode, config);

// on header changes
const targetNodeSearch = document.querySelector(".main-header .searchBox");
const targetNodeMenu = document.querySelector(
  ".main-header .navigation-tab > a"
);
const configForHeader = {
  attributes: true,
  childList: false,
  subtree: true,
  characterData: true
};

observer.observe(targetNodeSearch, configForHeader);
observer.observe(targetNodeMenu, configForHeader);
