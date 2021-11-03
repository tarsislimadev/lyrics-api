import fetch from 'node-fetch'
import path from 'path'
import fs from 'fs'

// URLS
const artistURL = 'https://api.lyrics.ovh/suggest/'

const songTitleURL = 'https://api.lyrics.ovh/v1/'

// CONSTANTS
const artist = 'Luísa Sonza'

// HELPERS
const fixString = (str = '') => str.replace(/ /ig, '+')
const pathOfArtist = (artist) => path.resolve('.', 'songs', fixString(artist))
const pathOfMusic = (artist, songTitle) => path.resolve(pathOfArtist(artist), fixString(songTitle)) + '.md'
const getJSON = (URL = '') => fetch(URL).then((res) => res.json())

// FUNCTIONS
const findArtist = (artist) => getJSON(artistURL + fixString(artist))

const findLyrics = (artist, songTitle) => getJSON(songTitleURL + fixString(artist) + '/' + fixString(songTitle))
  .then(({ lyrics = '' }) => fs.writeFileSync(pathOfMusic(artist, songTitle), lyrics))
  .catch((err) => console.error({ artist, songTitle, err }))

// RUN
fs.mkdir(pathOfArtist(artist), { recursive: true }, () => findArtist(artist).then(({ data }) => Promise.all(data.map(({ title }) => findLyrics(artist, title)))))
