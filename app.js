// Bai 1
// const data = [1, 2, 3, 5, 6, 2, 1, 6, 3, 5, 3];
const data = [1, 2, 3, 3, 3, 3, 5, 5, 5, 5, 5, 5, 5, 10, 11, 12, 13, 14, 14, 14, 14];
const countValue = (data) => {
   let count = 0;
   let value = 0;
   let countInLoop;
   for (let i = 0; i < data.length - 1; i++) {
      countInLoop = 1;
      for (let j = i + 1; j < data.length; j++) {
         if (data[i] === data[j]) {
            countInLoop++;
            if (countInLoop > count) {
               value = data[i];
               count = countInLoop;
            }
         }
      }
   }
   return {
      value: value,
      count: count,
   };
};
console.log(countValue(data));

// Bai 2
const $ = document.querySelector.bind(document);
const api = 'https://62660e73dbee37aff9ab8132.mockapi.io/api/contacts';
const appContact = {
   // Function get API
   getApi: (callback) => {
      fetch(api)
         .then((response) => {
            return response.json();
         })
         .then((contacts) => {
            callback(contacts);
         });
   },
   // Functon Render
   renderContacts: (contacts) => {
      const listContacts = $('.list-contacts');
      const htmls = contacts.map((e) => {
         return `
            <li>
               ${e.name}
               <span>${e.numberPhone}</span>
            </li>
         `;
      });
      listContacts.innerHTML = htmls.join('');
   },
   // Function handle create contacts
   handleCreateContacts: () => {
      const btnCreate = $('.btn-create');
      btnCreate.addEventListener('click', () => {
         const nameContact = $('.name-contact').value;
         const numberPhone = $('.number-phone').value;
         if (nameContact !== '' && numberPhone !== '') {
            const data = {
               name: nameContact,
               numberPhone: numberPhone,
            };
            const options = {
               method: 'POST',
               headers: {
                  'Content-Type': 'application/json',
               },
               body: JSON.stringify(data),
            };
            fetch(api, options)
               .then((response) => {
                  return response.json();
               })
               .then((contact) => {
                  const listContacts = $('.list-contacts');
                  const li = document.createElement('li');
                  const textContent = `
                     ${contact.name}
                     <span>${contact.numberPhone}</span>
                  `;
                  li.innerHTML = textContent;
                  listContacts.appendChild(li);
               });
         }
         $('.name-contact').value = '';
         $('.number-phone').value = '';
      });
   },
   // Function search contacts
   handleSearchContact: function () {
      const btnSearch = $('.btn-search');
      const inputSearch = $('.input-search');
      inputSearch.onchange = () => {
         this.getApi((contacts) => {
            inputSearch.onclick = () => {
               this.renderContacts(contacts);
            };
            btnSearch.onclick = () => {
               const arrContacts = contacts;
               const contactSearch = arrContacts.filter((e) => {
                  return e.name.toLowerCase().includes(inputSearch.value.toLowerCase());
               });
               this.renderContacts(contactSearch);
               inputSearch.value = '';
            };
         });
      };
   },
   // Function Filter element exist
   filterElementExits: (arr, key) => {
      const newArr = arr
         .map((e) => e[key])
         .map((e, i, arr) => arr.indexOf(e) === i && i)
         .filter((e) => arr[e])
         .map((e) => arr[e]);
      return newArr;
   },
   // Function get ID contacts
   getIdContacts: (contacst) => {
      const idContacts = contacst.map((e) => e.id);
      return idContacts;
   },

   // Function Method detele api

   deleteApi: (id) => {
      const options = {
         method: 'DELETE',
         headers: {
            'Content-Type': 'application/json',
         },
      };
      fetch(api + '/' + id, options);
   },
   // Function delete already exits
   handleDelete: function () {
      const btnDelete = $('.btn-delete');
      btnDelete.onclick = () => {
         this.getApi((contacts) => {
            const newContacts = this.filterElementExits(contacts, 'numberPhone');
            this.renderContacts(newContacts);
            const id = this.getIdContacts(newContacts);
            contacts.forEach((e) => {
               const isExits = id.some((d) => e.id === d);
               if (!isExits) {
                  this.deleteApi(e.id);
               }
            });
         });
      };
   },

   // Function starts
   starts: function () {
      this.getApi((contacts) => {
         this.renderContacts(contacts);
      });
      this.handleCreateContacts();
      this.handleSearchContact();
      this.handleDelete();
   },
};
appContact.starts();
