import fetch from 'node-fetch'
import path from 'path'
import fs from 'fs'

// URLS
const artistURL = 'https://api.lyrics.ovh/suggest/'

const songTitleURL = 'https://api.lyrics.ovh/v1/'

// CONSTANTS
const artist = 'Mamonas Assassinas'

// FUNCTIONS
const findArtist = async (artist) => await fetch(artistURL + fixString(artist)).then(res => res.json())

const findLyrics = (artist, songTitle) => fetch(songTitleURL + fixString(artist) + '/' + fixString(songTitle))
	.then((res) => res.json())
	.then(({ lyrics = '' }) => fs.writeFileSync(path.resolve('.', 'songs', artist, songTitle + '.md'), lyrics))
	.catch(err => console.error(artist, songTitle, err))

// HELPERS
const fixString = (str) => str.replace(' ', '+')

// RUN
fs.mkdir(path.resolve('.', 'songs', artist), { recursive: true }, () => findArtist(artist).then(({ data }) => Promise.all(data.map(({ title }) => findLyrics(artist, title)))))

