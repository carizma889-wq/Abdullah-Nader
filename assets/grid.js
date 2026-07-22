//@ts-nocheck
window.document.addEventListener("DOMContentLoaded", () => {
  const BtnCards = window.document.querySelectorAll("#BtnCard");
  const productContent = window.document.querySelector("#product");

  let selectedVariant = null;
  let selectedColor = "";
  let selectedSize = "";

  // NEW
  function updateVariant(product) {
    selectedVariant = product.variants.find((variant) => {
      return (
        variant.option1 === selectedSize && variant.option2 === selectedColor
      );
    });

    console.log("Selected Variant:", selectedVariant);
  }

  const cardProduct = window.document.querySelector("#cardProduct");
  const content_product = window.document.querySelector(".content_product");
  const img_content_product = window.document.querySelector(
    ".img_content_product",
  );
  const title_details_content_product = window.document.querySelector(
    ".title_details_content_product",
  );
  const salary_details_content_product = window.document.querySelector(
    ".salary_details_content_product",
  );
  const desc_details_content_product = window.document.querySelector(
    ".desc_details_content_product",
  );
  const color = window.document.querySelector(".color_detailsProduct");
  const size_detailsProduct = window.document.querySelector(
    ".size_detailsProduct",
  );
  const btnCart = window.document.querySelector(".btnCart");

  BtnCards.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();

      const gridItem = btn.closest(".grid-item");
      if (!gridItem) return;

      const handle = JSON.parse(gridItem.dataset.product);

      fetch(`/products/${handle}.js`)
        .then((res) => res.json())
        .then((product) => {
          selectedVariant = null;
          selectedColor = "";
          selectedSize = "";
          //  img
          const img = window.document.createElement("img");
          img_content_product.innerHTML = "";
          img.classList.add("img");
          img.src = `${product.images[0]}`;
          img.alt = "the image card product";
          img_content_product?.appendChild(img);
          // title
          title_details_content_product.innerHTML = "";
          const pElementTitle = window.document.createElement("p");
          pElementTitle.classList.add("ElementTitle");
          pElementTitle.innerText = `${product.title}`;
          title_details_content_product?.appendChild(pElementTitle);
          // salary
          salary_details_content_product.innerHTML = "";
          const pElementSalary = window.document.createElement("p");
          pElementSalary.classList.add("ElementSalary");
          pElementSalary.innerText = `$${(product.price / 100).toFixed(2)}`;
          salary_details_content_product?.appendChild(pElementSalary);
          // desc
          desc_details_content_product.innerHTML = "";
          desc_details_content_product.innerHTML = `${product.description}`;
          // color

          const colorOption = product.options.find(
            (option) => option.name === "Color",
          );

          color.innerHTML = "";

          const pElementColorName = window.document.createElement("p");
          pElementColorName.textContent = colorOption.name;
          color.appendChild(pElementColorName);

          const colorOptions = window.document.createElement("div");
          colorOptions.classList.add("color_options");

          selectedColor = colorOption.values[0];

          updateVariant(product);

          colorOption.values.forEach((value, index) => {
            const btn = window.document.createElement("button");

            btn.classList.add("color_btn");
            btn.textContent = value;

            if (index === 0) {
              btn.classList.add("active");
            }

            btn.addEventListener("click", () => {
              colorOptions.querySelectorAll(".color_btn").forEach((b) => {
                b.classList.remove("active");
              });

              btn.classList.add("active");

              selectedColor = value;

              updateVariant(product);
            });

            colorOptions.appendChild(btn);
          });

          color.appendChild(colorOptions);

          // size

          const sizeOption = product.options.find(
            (option) => option.name === "Size",
          );

          size_detailsProduct.innerHTML = "";

          const pElementSizeName = window.document.createElement("p");
          pElementSizeName.textContent = sizeOption.name;
          size_detailsProduct.appendChild(pElementSizeName);

          const selectWrapper = window.document.createElement("div");
          selectWrapper.classList.add("size_wrapper");

          const select = window.document.createElement("select");
          select.classList.add("size_select");

          const defaultOption = window.document.createElement("option");
          defaultOption.textContent = "Choose your size";
          defaultOption.disabled = true;
          defaultOption.selected = true;
          defaultOption.hidden = true;

          select.appendChild(defaultOption);

          sizeOption.values.forEach((value) => {
            const option = window.document.createElement("option");
            option.value = value;
            option.textContent = value;
            select.appendChild(option);
          });

          select.addEventListener("change", () => {
            selectedSize = select.value;

            updateVariant(product);
          });

          selectWrapper.appendChild(select);

          size_detailsProduct.appendChild(selectWrapper);

          btnCart.onclick = () => {
            if (!selectedVariant) {
              alert("Please choose your size.");
              return;
            }

            fetch("/cart/add.js", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                id: selectedVariant.id,
                quantity: 1,
              }),
            })
              .then((res) => res.json())
              .then((data) => {
                console.log("Added To Cart", data);

                if (
                  selectedColor === "Black" &&
                  (selectedSize === "M" || selectedSize === "Medium")
                ) {
                  fetch("/products/soft-winter-jacket.js")
                    .then((res) => res.json())
                    .then((jacket) => {
                      return fetch("/cart/add.js", {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                          id: jacket.variants[0].id,
                          quantity: 1,
                        }),
                      });
                    })
                    .then(() => {
                      console.log("Soft Winter Jacket Added");
                    });
                }
                productContent.style.display = "none";
              })
              .catch((err) => console.error(err));
          };
        });

      if (productContent) {
        productContent.style.display = "block";
      }
    });

    cardProduct?.addEventListener("click", (e) => {
      e.stopPropagation();
    });

    productContent?.addEventListener("click", () => {
      if (productContent) {
        productContent.style.display = "none";
      }
    });
  });
});
