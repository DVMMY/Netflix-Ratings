(() => {
  var API_KEY = configKeys.API_KEY;

  // add ratings on hover for each show item
  function addEvents() {
    // console.log("addevents triggered");
    let showBlocks = document.querySelectorAll(
      ".slider .showPeek .slider-item:not(.net-mod)"
    );
    showBlocks.forEach((showBlock) => {
      showBlock.addEventListener("mouseenter", () => {
        if (!showBlock.querySelector(".net-mod-rating-wrapper")) {
          // get show title
          let elemTitle = showBlock
            .querySelector(".fallback-text")
            .textContent.trim();

          const url = `https://www.omdbapi.com/?apikey=${API_KEY}&t=${elemTitle}`;
          fetch(url)
            .then((resp) => resp.json())
            .then(function (data) {
              // create rating element
              var ratingsWrapper = document.createElement("span");
              ratingsWrapper.classList.add("net-mod-rating-wrapper");
              let ratings = data.Ratings;
              ratings &&
                ratings.forEach((rating) => {
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

              // apply rating element to Preview block
              var ifTitleExist = setInterval(() => {
                let previewDisplay = window.document.querySelector(
                  ".previewModal--wrapper"
                );
                var thisTitleBlock = window.document.querySelector(
                  ".previewModal--player_container"
                );
                if (
                  typeof previewDisplay != "undefined" &&
                  previewDisplay != null &&
                  typeof thisTitleBlock != "undefined" &&
                  thisTitleBlock != null &&
                  document.querySelector(".net-mod-rating-wrapper") == null
                ) {
                  // console.log("rating applied");
                  previewDisplay
                    .querySelector(".previewModal--player_container")
                    .prepend(ratingsWrapper);
                  clearInterval(ifTitleExist);
                }
              }, 200);
              setTimeout(() => {
                clearInterval(ifTitleExist);
              }, 2000);
            })
            .catch(function (error) {
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
      .forEach((item) => {
        item.classList.add("net-prev-next");
        item.addEventListener("mousedown", (event) => {
          setTimeout(function () {
            addEvents();
            prevNextBtnEvents();
          }, 1000);
        });
      });
  }

  addEvents();
  prevNextBtnEvents();

  // for page scrolling & search bar updates
  const targetNode = document.querySelector("body");
  const config = {
    attributes: true,
    childList: false,
    subtree: false,
    characterData: true,
  };

  const callback = function (mutationsList, observer) {
    // console.log("MAIN mutation", mutationsList);
    setTimeout(function () {
      addEvents();
      prevNextBtnEvents();
    }, 1000);
  };

  const observer = new MutationObserver(callback);
  observer.observe(targetNode, config);

  // on header changes
  const targetNodeSearch = document.querySelector(".main-header .searchBox");
  const targetNodeMenu = document.querySelector(".pinning-header-container");

  const configForHeader = {
    attributes: true,
    childList: false,
    subtree: true,
    characterData: true,
  };

  observer.observe(targetNodeSearch, configForHeader);
  observer.observe(targetNodeMenu, configForHeader);
})();
