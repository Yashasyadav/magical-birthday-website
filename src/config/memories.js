/**
 * memories.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Data store for the Secret Memory Collection Wall.
 * Each memory has coordinate percentages for natural placement on the clotheslines,
 * along with handwritten labels, stickers, and flippable backside messages.
 */

export const MEMORIES = [
  {
    id: 1,
    title: "A Beautiful Beginning",
    date: "June 2012",
    image: "/photos/1.jpg",
    placeholderMessage: "Every magical journey begins with a beautiful memory. These tiny moments became the stars that light up your story. Though time moves forward, this precious piece of your childhood will always stay safe here, reminding you where your beautiful journey began.",
    rotation: -6,
    position: { x: 12, y: 22 },
    location: "Castle Gardens",
    type: "polaroid",
    emoji: "🏰"
  },
  {
    id: 2,
    title: "Mother's Pure Love",
    date: "September 2015",
    image: "/photos/2.jpg",
    placeholderMessage: "Behind your beautiful smile stands an even more beautiful woman—your mother. She became your greatest strength, your biggest supporter, and both the mother and father you needed. Her unconditional love shaped the wonderful person you are today.",
    rotation: 4,
    position: { x: 31, y: 18 },
    location: "Home Hearth",
    type: "postcard",
    emoji: "👩‍👧"
  },
  {
    id: 3,
    title: "Inseparable Companions",
    date: "October 2018",
    image: "/photos/3.jpg",
    placeholderMessage: "Watching the bond you share always brings a smile. Through every little fight and every happy moment, you've always been each other's greatest companion. That's what makes your bond so beautiful.",
    rotation: -3,
    position: { x: 50, y: 24 },
    location: "Enchanted Forest",
    type: "scrap",
    emoji: "👯‍♀️"
  },
  {
    id: 4,
    title: "Our Guardian Lucky",
    date: "December 2019",
    image: "/photos/4.jpg",
    placeholderMessage: "Lucky may just be a teddy to others, but I know it's much more to you. It became a part of your little family, holding your happiest memories, biggest hugs, and countless emotions. Some companions never speak, yet they understand us the most.",
    rotation: 5,
    position: { x: 69, y: 16 },
    location: "Dreamland Gate",
    type: "polaroid",
    emoji: "🧸"
  },
  {
    id: 5,
    title: "Friendship For Life",
    date: "April 2021",
    image: "/photos/5.jpg",
    placeholderMessage: "The bond you both share is truly beautiful. Sometimes I wish I could steal just a tiny part of the friendship you have with her. But more than that, I'm happy you've found someone who believes in you the way she does. May your friendship last forever.",
    rotation: -4,
    position: { x: 88, y: 22 },
    location: "Sunny Valley",
    type: "filmstrip",
    emoji: "👭"
  },
  {
    id: 6,
    title: "Comfort in Your Smile",
    date: "August 2023",
    image: "/photos/6.jpg",
    placeholderMessage: "Coming back to you... There's something so comforting about your smile and those innocent eyes. They have a way of making people feel loved, happy, and completely at ease. Never lose that beautiful innocence—it truly is your greatest charm.",
    rotation: 4,
    position: { x: 12, y: 58 },
    location: "Whispering Meadows",
    type: "postcard",
    emoji: "✨"
  },
  {
    id: 7,
    title: "Growing with Confidence",
    date: "May 2024",
    image: "/photos/7.jpg",
    placeholderMessage: "You've changed so much from your school days, and it's amazing to see you growing with confidence. Keep working hard, enjoy every college memory, and make your mom proud of the person you're becoming.",
    rotation: -5,
    position: { x: 31, y: 52 },
    location: "Royal Academy",
    type: "polaroid",
    emoji: "🎓"
  },
  {
    id: 8,
    title: "First Independent Steps",
    date: "July 2024",
    image: "/photos/8.jpg",
    placeholderMessage: "I think this was one of your first journeys without your family, and it looks like you truly enjoyed every moment. Just like the \"LOVE\" in this picture, I hope one day you find someone who walks beside you, values you, and fills your life with happiness. Because someone as kind as you deserves a love that's genuine and forever.",
    rotation: 3,
    position: { x: 50, y: 60 },
    location: "City of Love",
    type: "postcard",
    emoji: "🗺️"
  },
  {
    id: 9,
    title: "Beaches & Happy Waves",
    date: "November 2025",
    image: "/photos/9.jpg",
    placeholderMessage: "I think beaches are your happy place. The waves, the breeze, and your smile seem to belong together. I hope life always gives you moments as peaceful as this. Never stop chasing the places that make your heart feel at home.",
    rotation: -4,
    position: { x: 69, y: 54 },
    location: "Golden Shore",
    type: "scrap",
    emoji: "🌊"
  },
  {
    id: 10,
    title: "Our Unforgettable Portrait",
    date: "Today",
    image: "/photos/10.jpg",
    placeholderMessage: "And finally... The one and only photo we have together. I still remember those wonderful school days, the laughter, the conversations, and our unforgettable friendship. Sometimes I wish we could go back and relive those moments once again, because I truly miss them.",
    rotation: 6,
    position: { x: 88, y: 58 },
    location: "Sweet 19 Chapter",
    type: "polaroid",
    emoji: "📸"
  }
];

export default MEMORIES;
