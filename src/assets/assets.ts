/**
 * Asset collection for GenRe Kota Bengkulu application
 * Centralized management of all static assets including images and icons
 */


// Image imports
import formQuestions from './faq.png'
import genbi_logo from './genbilogo.png'
import logo_genbi from './logogenbi.png'
import genbi_komisariat from './genbikomisariat.png'
import genbi_people from './genbipeople.jpg'
import genrebackground from './genrebackground.jpg'

// SVG placeholders for missing assets
const PLACEHOLDER_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23e5e7eb'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='14' fill='%236b7280'%3EImage%3C/text%3E%3C/svg%3E"

const FAQ_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f3f4f6'/%3E%3Ccircle cx='200' cy='150' r='60' fill='%236366f1'/%3E%3Ctext x='200' y='160' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='24' fill='white'%3EFAQ%3C/text%3E%3C/svg%3E"

const ARROW_ICON = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23129990' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m9 18 6-6-6-6'/%3E%3C/svg%3E"

const ARROW_ICON_WHITE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m9 18 6-6-6-6'/%3E%3C/svg%3E"

/**
 * Centralized asset collection with proper TypeScript typing
 */
export const assets = {
  // Form and UI images
  formQuestions,
  genbi_logo,
  logo_genbi,
  genbi_komisariat,
  genbi_people,
  genrebackground,
  
  // Placeholder images
  drink: PLACEHOLDER_IMAGE,
  drink2: PLACEHOLDER_IMAGE,
  faq_image: FAQ_IMAGE,
  
  // Icon assets
  arrow_icon: ARROW_ICON,
  arrow_icon_white: ARROW_ICON_WHITE,
}