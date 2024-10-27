document.addEventListener("DOMContentLoaded", function () {

    function generateItemAdult(index) {
        const html = `
    <div class="item p-3 rounded-2 mt-2 border-secondary border">
      <div class="item-title">
          <h4>Người lớn</h4>
      </div>
      <ul class="item-list p-0">
        <li class="item d-flex justify-content-between row">
          <div class="input col-sm-4">
              Họ tên
              <input type="text" name="name-adult-${index}" class="w-100" required>
          </div>
          <div class="input col-sm-4">
              Giới tính
              <select name="sex-adult-${index}" class="w-100" required>
                  <option  value="1 ">Nam</option>
                  <option value="2">Nữ</option>
              </select>
          </div>
          <div class="input col-sm-4">
              Ngày sinh
              <input type="date" name="birthday-adult-${index}" class="w-100" required>
          </div>
        </li>
      </ul>
    </div>`;
        // Tạo một div tạm để chuyển đổi chuỗi HTML thành Node
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;

        // Trả về phần tử đầu tiên trong tempDiv, nó là Node
        return tempDiv.firstElementChild;
    }

    function generateItemChild(index) {
        const html = `
    <div class="item p-3 rounded-2 mt-2 border-secondary border">
      <div class="item-title">
          <h4>Trẻ em</h4>
      </div>
      <ul class="item-list p-0">
        <li class="item d-flex justify-content-between row">
          <div class="input col-sm-4">
              Họ tên
              <input type="text" name="name-child-${index}" class="w-100">
          </div>
          <div class="input col-sm-4">
              Giới tính
              <select name="sex-child-${index}" class="w-100">
                  <option value="1">Nam</option>
                  <option value="2">Nữ</option>
              </select>
          </div>
          <div class="input col-sm-4">
              Ngày sinh
              <input type="date" name="birthday-child-${index}" class="w-100">
          </div>
        </li>
      </ul>
    </div>`;
        // Tạo một div tạm để chuyển đổi chuỗi HTML thành Node
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;

        // Trả về phần tử đầu tiên trong tempDiv, nó là Node
        return tempDiv.firstElementChild;
    }

    // element chỉnh so luong nguoi lon/ tre em
    const elementMinusBtnChild = document.getElementById("minus-btn-child");
    const elementPlusBtnChild = document.getElementById("plus-btn-child");
    const elementCounterValueChild = document.getElementById("value-child");
    const elementMinusBtnAdult = document.getElementById("minus-btn-adult");
    const elementPlusBtnAdult = document.getElementById("plus-btn-adult");
    const elementCounterValueAdult = document.getElementById("value-adult");

    const elementItemsAdultInfo = document.getElementById("items-adult");
    const elementItemsChildInfo = document.getElementById("items-child");

    const elementPriceCustomer = document.getElementById("price-customer");
    const elementPriceAdult = document.getElementById("price-adult");
    const elementPriceChild = document.getElementById("price-child");
    const elementTotalPrice = document.getElementById("total-price");
    const elementValueDiscount =document.getElementById("value-discount");


    let countChild = 0;
    let countAdult = 0;
    let discountValue = 0;

    // Hàm giảm giá trị
    elementMinusBtnChild.addEventListener("click", () => {
            handleQuantity("minus", "child");
        }
    );
    elementPlusBtnChild.addEventListener("click", () => {
            handleQuantity("plus", "child");
        }
    );
    elementMinusBtnAdult.addEventListener("click", () => {
            handleQuantity("minus", "adult");
        }
    );
    elementPlusBtnAdult.addEventListener("click", () => {
            handleQuantity("plus", "adult");
        }
    );

    function handleQuantity(action, type) {
        const elementArray = document.createElement('div');
        if (type === "child") {
            if (action == "minus" && countChild > 0) {
                countChild--;
            }
            if (action == "plus") {
                countChild++;
            }

            for (let i = 0; i < countChild; i++)
                elementArray.appendChild(generateItemChild(i));
            elementItemsChildInfo.innerHTML = elementArray.innerHTML;
            elementCounterValueChild.value = countChild;
        } else {
            if (action == "minus" && countAdult > 0) {
                countAdult--;
            }
            if (action == "plus") {
                countAdult++;
            }
            for (let i = 0; i < countAdult; i++)
                elementArray.appendChild(generateItemAdult(i));
            elementItemsAdultInfo.innerHTML = elementArray.innerHTML;
            elementCounterValueAdult.value = countAdult;
        }
        ChangedValue();
    }

    function ChangedValue() {
        const priceAdult = tourTimeResponse.priceAdult * countAdult;
        const priceChild = tourTimeResponse.priceChild * countChild;
        const totalPrice = priceAdult + priceChild - discountValue;
        elementPriceAdult.innerHTML = `${countAdult} x <b>${tourTimeResponse.priceAdult.toLocaleString('vi-VN')} ₫</b>`;
        elementPriceChild.innerHTML = `${countChild} x <b>${tourTimeResponse.priceChild.toLocaleString('vi-VN')} ₫</b>`;
        elementPriceCustomer.innerHTML = `<b>${(priceAdult + priceChild).toLocaleString('vi-VN')} ₫</b>`;
        elementTotalPrice.innerHTML = `<b>${(totalPrice > 0 ? totalPrice : 0).toLocaleString('vi-VN')} ₫</b>`;
        elementValueDiscount.innerHTML=`- <b>${discountValue.toLocaleString('vi-VN')} ₫</b>`
    }

    async function fetchDiscountByCode(discountCode) {
        try {
            const response = await fetch(`/api/discount?code=${discountCode}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const discount = await response.json();
                console.log('Discount:', discount);
                discountValue = discount.discountValue;
                return true; // Mã giảm giá hợp lệ
            } else {
                console.log('Mã giảm giá không tìm thấy');
                return false; // Mã giảm giá không hợp lệ
            }
        } catch (error) {
            console.error('Error fetching discount:', error);
            discountCode=0;
            return false;
        }
    }

    document.getElementById("btn-check-discount").addEventListener("click", async () => {
        const isValid = await fetchDiscountByCode(document.getElementById("value-code-voucher").value);

        if (isValid) {
            document.getElementById("box-mess-voucher").textContent = `Áp dụng mã giảm giá thành công`;
            document.getElementById("box-mess-voucher").classList.remove("border-danger");
            document.getElementById("box-mess-voucher").classList.add("border-success","p-2","border");
            ChangedValue();
        } else {
            document.getElementById("box-mess-voucher").textContent = `Áp dụng mã giảm giá không thành công`;
            document.getElementById("box-mess-voucher").classList.remove("border-success");
            document.getElementById("box-mess-voucher").classList.add("border-danger","p-2","border");
            ChangedValue();
        }
    });


    document.getElementById("submit-form").addEventListener("submit", async function(event) {
        event.preventDefault();

        const formData = new FormData(this);

        const processedData = {
            name: formData.get('name'),
            phone: formData.get('phone'),
            address: formData.get('address'),
            voucherCode: formData.get("value-code-voucher"),
            adults: [],
            children: [],
            note: formData.get('note'),
            tourTimeId:tourTimeResponse.tourTimeId
        };
        for(let i=0;i<formData.get('valueAdult');i++)
            processedData.adults.push({
                customerName: formData.get(`name-adult-${i}`),
                sex: formData.get(`sex-adult-${i}`),
                birthday:formData.get(`birthday-adult-${i}`)
            });
        for(let i=0;i<formData.get('valueChild');i++)
            processedData.children.push({
                customerName: formData.get(`name-child-${i}`),
                sex: formData.get(`sex-child-${i}`),
                birthday:formData.get(`birthday-child-${i}`)
            });



        try {
            // Gửi dữ liệu qua API
            const response = await fetch("/api/order-booking/submit-form", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(processedData),
            });
            console.log(processedData)

            if (!response.ok) throw new Error("Có lỗi xảy ra");

            const result = await response.json();
            alert("Gửi dữ liệu thành công!");
        } catch (error) {
            console.error("Lỗi:", error);
            alert("Gửi dữ liệu thất bại!");
        }
    });
});
