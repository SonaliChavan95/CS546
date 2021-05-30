(function () {
  function checkNumber(num) {
    if (isNaN(num)) throw 'Must provide a number';
    if (typeof num !== 'number') throw 'Must provide a number';
    if(num < 0) throw 'Enter positive number';
  }

  function fibonacci(current, prev, num) {
    if (num == 0) {
      return 0;
    } else if (num == 1) {
      return current;
    } else {
      return fibonacci(current + prev, current, num - 1);
    }
  }

  function isPrime(num) {
    var n, i, flag = true;

    if(num >= 2) {
      for (i = 2; i <= num - 1; i++)
        if (num % i == 0) {
          flag = false;
          break;
        }
    }
    else
      flag = undefined;

    return flag;
  }

  const staticForm = $('#static-form');

  if(staticForm) {
    const firstNumberElement = $('#number');
    const errorContainer = $('#error-container');
    const errorTextElement = errorContainer.find('.error-list');

    const resultContainer = $('#results');
    staticForm.submit(function(e) {
      e.preventDefault();
      try {
        errorContainer.addClass('hidden');

        const firstNumberValue = firstNumberElement.val();
        const parsedFirstNumberValue = parseInt(firstNumberValue);
        checkNumber(parsedFirstNumberValue);
        const result = fibonacci(1, 0, parsedFirstNumberValue);
        var resultTextElement = $('<li></li>');
        resultTextElement.text(`The Fibonacci of ${firstNumberValue} is ${result}.`);
        firstNumberElement.val('');

        var resultClass;
        if(isPrime(result) === undefined) {
          resultClass = '';
        } else if(isPrime(result)) {
          resultClass = 'is-prime';
        } else {
          resultClass = 'not-prime';
        }
        resultTextElement.addClass(resultClass);
        resultContainer.append(resultTextElement);
      } catch (e) {
        const message = typeof e === 'string' ? e : e.message;
        errorTextElement.text(message);
        errorContainer.removeClass('hidden');
      }
    });
  }
})();