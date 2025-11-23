// Test de vérification du déblocage des dialogues

const ALL_DIALOGUES = [
  { id: 'day1_bjorn_intro', unlockDay: 1 },
  { id: 'day1_lyra_intro', unlockDay: 1 },
  { id: 'day2_thorin_upgrade', unlockDay: 2 }
]

function getDialoguesForDay(day) {
  return ALL_DIALOGUES.filter(d => d.unlockDay <= day)
}

function getNewDialoguesForDay(day) {
  return ALL_DIALOGUES.filter(d => d.unlockDay === day)
}

console.log('=== TEST DÉBLOCAGE DIALOGUES ===\n')

console.log('Jour 1 (début du jeu) :')
const day1 = getDialoguesForDay(1)
console.log(`  - Dialogues disponibles: ${day1.length}`)
console.log(`  - IDs: ${day1.map(d => d.id).join(', ')}`)
console.log(`  - ✅ Attendu: 2 dialogues\n`)

console.log('Jour 2 (après nextDay()) :')
const day2 = getDialoguesForDay(2)
const newDay2 = getNewDialoguesForDay(2)
console.log(`  - Dialogues disponibles: ${day2.length}`)
console.log(`  - IDs: ${day2.map(d => d.id).join(', ')}`)
console.log(`  - Nouveaux dialogues: ${newDay2.length}`)
console.log(`  - IDs nouveaux: ${newDay2.map(d => d.id).join(', ')}`)
console.log(`  - ✅ Attendu: 3 dialogues total (1 nouveau)\n`)

console.log('Jour 3 (après nextDay()) :')
const day3 = getDialoguesForDay(3)
const newDay3 = getNewDialoguesForDay(3)
console.log(`  - Dialogues disponibles: ${day3.length}`)
console.log(`  - Nouveaux dialogues: ${newDay3.length}`)
console.log(`  - ✅ Attendu: 3 dialogues total (0 nouveau)\n`)

console.log('=== RÉSULTAT ===')
const test1 = day1.length === 2
const test2 = day2.length === 3 && newDay2.length === 1
const test3 = day3.length === 3 && newDay3.length === 0

console.log(`Jour 1: ${test1 ? '✅ PASS' : '❌ FAIL'}`)
console.log(`Jour 2: ${test2 ? '✅ PASS' : '❌ FAIL'}`)
console.log(`Jour 3: ${test3 ? '✅ PASS' : '❌ FAIL'}`)
console.log(`\nTOUS LES TESTS: ${test1 && test2 && test3 ? '✅ PASS' : '❌ FAIL'}`)
