  a = [...document.querySelectorAll('.bean_block_deck_list')];
  data = a.map(el => {
    const name = el.querySelector('h4').innerText;
    const cards = [...el.querySelectorAll('.sorted-by-overview-container .row')].map(cardEl => {
      const count = parseInt(cardEl.querySelector('.card-count').innerText, 10);
      const name = cardEl.querySelector('.card-name').innerText;
      return {
        count,
        name,
      };
    }).reduce((carry, next) => {
      for(let x = 0; x < next.count; x++) {
        carry.push(next.name);
      }
      return carry;
    }, []);

    const shortName = name.match(/(.*) \(?\d+\)?/)?.[1] || name;

    return {
      name,
      cards,
      shortName,
    };
  });
  console.log(data[0]);