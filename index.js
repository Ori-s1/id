let currentDate = new Date();
let isMonthlyView = true;
let events = JSON.parse(localStorage.getItem('calendarEvents')) || {};

function renderCalendar() {
    const calendar = document.getElementById('calendar');
    calendar.classList.add('fade-out');
    
    setTimeout(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        document.getElementById('monthYear').textContent = 
            `${currentDate.toLocaleString('he', { month: 'long' })} ${year}`;
        const header = document.getElementById('calendarHeader');
        const body = document.getElementById('calendarBody');
        header.innerHTML = '';
        body.innerHTML = '';

        if (isMonthlyView) {
            renderMonthlyView(year, month, header, body);
        } else {
            renderWeeklyView(year, month, header, body);
        }

        document.querySelector('.controls button:nth-child(3)').textContent = 
            isMonthlyView ? 'תצוגה שבועית' : 'תצוגה חודשית';
        
        calendar.classList.remove('fade-out');
    }, 300);
}

function renderMonthlyView(year, month, header, body) {
    const days = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];
    let tr = '<tr>';
    days.forEach(day => tr += `<th>${day}</th>`);
    header.innerHTML = tr + '</tr>';

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    let date = 1;

    for (let i = 0; i < 6; i++) {
        tr = '<tr>';
        for (let j = 0; j < 7; j++) {
            if (i === 0 && j < firstDay) {
                tr += '<td></td>';
            } else if (date > daysInMonth) {
                tr += '<td></td>';
            } else {
                const today = new Date();
                const isToday = date === today.getDate() && 
                              month === today.getMonth() && 
                              year === today.getFullYear();
                const eventKey = `${year}-${month}-${date}`;
                const eventText = events[eventKey] ? `<div class="event-text">${events[eventKey]}</div>` : '';
                tr += `<td class="${isToday ? 'current-day' : ''} ${events[eventKey] ? 'event' : ''}">
                        ${date}${eventText}</td>`;
                date++;
            }
        }
        tr += '</tr>';
        body.innerHTML += tr;
    }
}

function renderWeeklyView(year, month, header, body) {
    const days = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];
    let tr = '<tr>';
    days.forEach(day => tr += `<th>${day}</th>`);
    header.innerHTML = tr + '</tr>';

    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    
    tr = '<tr>';
    for (let i = 0; i < 7; i++) {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);
        const isToday = date.toDateString() === new Date().toDateString();
        const eventKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
        const eventText = events[eventKey] ? `<div class="event-text">${events[eventKey]}</div>` : '';
        tr += `<td class="${isToday ? 'current-day' : ''} ${events[eventKey] ? 'event' : ''}">
                ${date.getDate()}${eventText}</td>`;
    }
    tr += '</tr>';
    body.innerHTML = tr;
}

function showEventForm() {
    const form = document.getElementById('eventForm');
    form.classList.toggle('hidden');
}

function addEvent() {
    const eventText = document.getElementById('eventText').value;
    const eventDay = document.getElementById('eventDay').value;
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    if (eventText && eventDay) {
        const eventKey = `${year}-${month}-${eventDay}`;
        events[eventKey] = eventText;
        localStorage.setItem('calendarEvents', JSON.stringify(events));
        document.getElementById('eventText').value = '';
        document.getElementById('eventDay').value = '';
        showEventForm();
        renderCalendar();
    }
}
function deleteEvent() {
    const eventDay = document.getElementById('eventDay').value;
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    if (eventDay) {
        const eventKey = `${year}-${month}-${eventDay}`;
        if (events[eventKey]) {
            delete events[eventKey];
            localStorage.setItem('calendarEvents', JSON.stringify(events));
            document.getElementById('eventText').value = '';
            document.getElementById('eventDay').value = '';
            showEventForm();
            renderCalendar();
        } else {
            alert('אין אירוע למחיקה ביום זה');
        }
    }
}


function prevMonth() {
    if (isMonthlyView) {
        currentDate.setMonth(currentDate.getMonth() - 1);
    } else {
        currentDate.setDate(currentDate.getDate() - 7);
    }
    renderCalendar();
}

function nextMonth() {
    if (isMonthlyView) {
        currentDate.setMonth(currentDate.getMonth() + 1);
    } else {
        currentDate.setDate(currentDate.getDate() + 7);
    }
    renderCalendar();
}

function toggleView() {
    isMonthlyView = !isMonthlyView;
    renderCalendar();
}

renderCalendar();