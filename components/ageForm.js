import DateDiff from '../lib/date-diff';
import { useEffect, useState } from "react";
import styles from './ageForm.module.scss';

export default function AgeForm() {
  const [errorMessages, setErrorMessages] = useState({day: null, month: null, year: null});
  const [dateDiff, setDateDiff] = useState({d: null, m: null, y: null});

  function isValid(date) {
    const currentDate = new Date(), enteredDate = new Date();
    let valid = true;
    const messages = {day: null, month: null, year: null};
    const required = 'This field is required';

    //validate year
    if (date.year === '') {
      messages.year = required;
      valid = false;
    } else if (date.year < 1 || date.year > 9999) {
      messages.year = 'Must be a valid year';
      valid = false;
    } else enteredDate.setFullYear(date.year);

    //validate month
    if (date.month === '') {
      messages.month = required;
      valid = false;
    } else if (date.month < 1 || date.month > 12) {
      messages.month = 'Must be a valid month';
      valid = false;
    } else enteredDate.setMonth(date.month - 1);

    //validate day
    if (date.day === '') {
      messages.day = required;
      valid = false;
    }else if (date.day < 1 || date.day > new Date(enteredDate.getFullYear(), enteredDate.getMonth() + 1, 0).getDate()) {
      messages.day = 'Must be a valid day';
      valid = false;
    } else enteredDate.setDate(date.day);

    //check if in the past
    if (valid) {
      const past = 'Must be in the past';
      if (enteredDate.getFullYear() > currentDate.getFullYear()) {
        messages.year = past;
        valid = false;
      }

      if (enteredDate.getFullYear() === currentDate.getFullYear()
        && enteredDate.getMonth() > currentDate.getMonth()) {
        messages.month = past;
        valid = false;
      }

      if (enteredDate.getFullYear() === currentDate.getFullYear()
        && enteredDate.getMonth() === currentDate.getMonth()
        && enteredDate.getDate() > currentDate.getDate()) {
        messages.day = past;
        valid = false;
      }
    }

    setErrorMessages(messages);

    return valid;
  }
  
  function getDate(form) {
    const date = {year: 0, month: 0, day: 0};

    for (const key in date) {
      date[key] = form.elements.namedItem(key).value;
    }

    return date;
  }

  function manageValidity(form) {
    const set = (msg) => {
      for (const key in errorMessages) {
        form.elements.namedItem(key).setCustomValidity(msg);
      }
    }

    if (isValid(getDate(form))) {
      set('');
      return true;
    }
    
    set('invalid');
    return false;
  }


  function handleChange(e) {
    e.preventDefault()

    manageValidity(e.currentTarget);
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!manageValidity(e.currentTarget))
      return;
    
    let enteredDate = getDate(e.currentTarget);
    enteredDate = new Date(enteredDate.year, enteredDate.month - 1, enteredDate.day);

    const currentDate = new Date();
    const newDateDiff = new DateDiff(currentDate, enteredDate);


    let y = Math.floor(newDateDiff.years());
    
    let m = Math.floor(newDateDiff.months());

    const monthDiff = new DateDiff(
      new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
      new Date(currentDate.getFullYear(), currentDate.getMonth() - m, 1)
    )

    const d = Math.floor(newDateDiff.days() - monthDiff.days());

    if (y >= 1) {
      m %= (y * 12);
    }

    if (m === 12) {
      y += 1;
      m = 0;
    }
    
    
    setDateDiff({d, m, y})
  }



  return <div className={styles.widget}>
    <form className={styles.form}
    onChange={handleChange}
    onSubmit={handleSubmit}
    onInvalid={e => e.preventDefault()}>
    <Input name='day' type='number' placeholder="DD"
      message={errorMessages.day}
      min={1} max={31}
      />
    <Input name='month' type='number' placeholder="MM"
      message={errorMessages.month}
      min={1} max={12}
      />
    <Input name='year' type='number' placeholder="YYYY"
      message={errorMessages.year}
      min={1} max={9999}
      />
    <button></button>
  </form>

  <div className={styles.result}>
    <span>{dateDiff.y ?? '- -'}</span> year{dateDiff.y !== 1 && 's'}<br />
    <span>{dateDiff.m ?? '- -'}</span> month{dateDiff.m !== 1 && 's'}<br />
    <span>{dateDiff.d ?? '- -'}</span> day{dateDiff.d !== 1 && 's'}<br />
  </div>
</div>
}

function Input({name, message, ...inputProps}) {
  return <div className={styles.formInput}>
    <h4>{name.toUpperCase().split("").join(' ')}</h4>
    <input name={name} {...inputProps} />
    <p>{message ? message : '\u00A0'}</p>
  </div>
}