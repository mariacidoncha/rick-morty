Individual project 2 - AIT

# TABLE OF CONTENT
- [TABLE OF CONTENT](#table-of-content)
- [DAILY RECORDS](#daily-records)
- [ISSUES](#issues)
      - [1. Export/Import statement doesn't work](#1-exportimport-statement-doesnt-work)
    - [2. Origin: unknown](#2-origin-unknown)


# DAILY RECORDS
Day 1: 12/01/2024
- Create a GitHub repository
- Discover API's structure
- Add Rick and Morty font

Day 2: 15/01/2024
- Split episodes in seasons
- Set button for each season
- Set side bar menu
- Display card episode in each season

Day 3: 16/01/2024
- Display episode info (code, title, air date and characters) in the main container throw an event listener in the episode card
- Display button in episode info for going back
- Display character info (image, name, species, status, gender, origin and episodes where appears(you can go on click)) in the main container throw an event listener in the character card
- Create Location interface
- Display origin info () in the main container throw an event listener in the anchor origin
- Add CSS to HTML
- Add scrollbar in the side bar menu

# ISSUES
#### 1. Export/Import statement doesn't work
    Change tsconfig.json:
    "target": "ES6" and "module": "ES6"- [DAILY RECORDS](#daily-records)

### 2. Origin: unknown
      If I try to display info about origin: unknown I will get an error.
      I fix this with:
      if(character.origin.name != 'unknown'){
        document.getElementById(`${character.origin.name}_a`)?.addEventListener('click', showOrigin);
      }
      Add the event listener only if the origin is not unknown

 
