/**
 * Load, parse json structure and populate the database 
 */
const {pick} = require('lodash')
const moment = require('moment')
const models = require('../server/models')
const json = require('./schedule.json')

const DEFAULT_ROLE = 'speaker'
const PARSE_DATE = 'ddd MMM D HH:mm:ss ZZ YYYY'
/**
 * Filter an object and leave only DB acceptable fields for the table person
 * @param {*} raw person data (may contain name (not splitted), or talks array)
 */
function filterPersonFields(raw) {
  return pick(raw, [
    'avatarUrl',
    'firstName',
    'github',
    'id',
    'lastName',
    'role',
    'twitter',
    'url'
  ])
}

/**
 * Filter an object and leave only DB acceptable fields for the table event
 * @param {*} raw event data
 */
function filterEventFields(raw) {
  return pick(raw, [
    'cocUrl',
    'name',
    'description',
    'id',
    'offset',
    'slug',
    'startDate',
    'timezoneId',
    'twitterHandle',
    'venueCity',
    'venueCountry',
    'venueName',
    'websiteUrl',
    'hasEnded',
    'hasStarted',
    'onGoing',
    'nextFiveScheduledItems'
  ])
}

async function parseEvent(event) {
  // populate the event
  try {
    await models.Event.create(
      filterEventFields({
        ...event,
        startDate: moment(event.startDate, PARSE_DATE).format()
      })
    )
  } catch (e) {}
  // parse all sponsors
  Object.entries(event.sponsors).forEach(([rating, list]) => {
    list.forEach(async sponsor => {
      try {
        await models.Sponsor.create({...sponsor, rating})
      } catch (e) {}
    })
  })
  // process all collaborators
  event.collaborators.forEach(async person => {
    let firstName, lastName
    if (person.name) {
      ;[firstName, lastName] = person.name.split(/\s+/)
      if (!person.firstName) person.firstName = firstName
      if (!person.lastName) person.lastName = lastName
    }
    try {
      await models.Person.create(
        filterPersonFields({role: DEFAULT_ROLE, ...person})
      )
    } catch (e) {}
  })
  // process all speakers
  event.speakers.forEach(async speaker => {
    let firstName, lastName
    if (speaker.name) {
      ;[firstName, lastName] = speaker.name.split(/\s+/)
      if (!speaker.firstName) speaker.firstName = firstName
      if (!speaker.lastName) speaker.lastName = lastName
    }
    if (speaker.talks) {
      // process all speaker talks
      speaker.talks.forEach(async talk => {
        try {
          await models.Talk.create({
            ...talk,
            startDate: moment(talk.startDate, PARSE_DATE).format(),
            event: event.id,
            person: speaker.id
          })
        } catch (e) {}
      })
    }
    // populate the person
    await models.Person.create(
      filterPersonFields({role: DEFAULT_ROLE, ...speaker})
    )
  })
  event.groupedSchedule.forEach(async schedule => {
    try {
      await parseSchedule(schedule)
    } catch (e) {}
  })
}

function parseSchedule(schedule) {
  // parse slots for each schedule
  schedule.slots.forEach(slot => parseSlot(slot))
}

function parseSlot(slot) {
  // process all speakers in slot
  slot.speakers.forEach(async person => {
    const [firstName, lastName] = person.name.split(/\s+/)
    try {
      await models.Person.create(
        filterPersonFields({role: DEFAULT_ROLE, ...person, firstName, lastName})
      )
    } catch (e) {}
  })
}
;(async () => {
  const delay = time => new Promise(res => setTimeout(() => res(), time))
  await delay(5000)
  json.events.forEach(async event => await parseEvent(event))
  console.log('Preload complete')
})()
