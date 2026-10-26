import * as fs from 'fs';
import * as path from 'path';

const gamesDir = path.resolve('content/games');

const additionalGames = [
  // 1. Even numbers up to 50
  {
    slug: 'even-numbers-up-to-50',
    grade: 2,
    topic: 'operations',
    standards: ['CCSS.MATH.CONTENT.2.OA.C.3'],
    seo: {
      title: 'Even Numbers to 50 Speed Grid - Elementary Parity Clicker',
      metaDescription: 'Find every even number up to 50 on a 100-number grid. Fast-paced math fluency game reinforcing skip counting and parity for 2nd graders.',
      h1: 'Even Numbers Up to 50 Speed Grid',
      intro: 'Even numbers represent quantities that can be arranged into equal pairs without any remainder left behind. Every even whole number finishes with the final digit 0, 2, 4, 6, or 8. In this elementary game, students look across a 100-tile grid to locate all 25 even numbers from 2 up to 50. Building rapid parity recognition helps young students transition smoothly from early skip counting into multiplication tables, division, and number patterns.',
      howToPlay: 'Scan the 100-number grid and click every even number that is less than or equal to 50. Correct clicks highlight green with a checkmark. Odd numbers or numbers greater than 50 trigger a red flash and a 2-second time penalty. Discover all 25 even numbers before the timer runs out.',
      teacherNotes: 'Prompt second graders to observe the vertical striping pattern on the 10-wide hundreds chart. Emphasize how every column ending in 2, 4, 6, 8, or 0 contains only even numbers.',
      faq: [
        { q: 'What is the fastest way to recognize an even number?', a: 'Always look directly at the ones place. If the digit is 0, 2, 4, 6, or 8, the entire number is even regardless of how many digits precede it.' },
        { q: 'How many even numbers exist between 1 and 50?', a: 'There are exactly 25 even numbers between 1 and 50, starting with 2 and concluding with 50.' }
      ],
      related: ['odd-numbers-up-to-50', 'multiples-of-5-grid', 'multiples-of-10-grid']
    },
    game: {
      prompt: 'Click even numbers up to 50',
      seconds: 50,
      pool: { type: 'range', from: 1, to: 100 },
      display: 'decimal',
      rule: { name: 'even_up_to', params: { max: 50 } },
      allowShuffle: true
    }
  },

  // 2. Odd numbers up to 50
  {
    slug: 'odd-numbers-up-to-50',
    grade: 2,
    topic: 'operations',
    standards: ['CCSS.MATH.CONTENT.2.OA.C.3'],
    seo: {
      title: 'Odd Numbers to 50 Speed Grid - Elementary Number Sense',
      metaDescription: 'Spot all odd numbers up to 50 on a 100-tile chart. Build fundamental number sense, parity identification, and mental math agility.',
      h1: 'Odd Numbers Up to 50 Speed Grid',
      intro: 'An odd number is any integer that cannot be divided evenly into two whole-number halves; grouping odd items into pairs always leaves a single solitary item remaining. Odd numbers consistently end in the digits 1, 3, 5, 7, or 9. This speed clicker trains primary students to quickly scan numbers 1 through 100 and click the 25 odd numbers bounded between 1 and 50, reinforcing algebraic parity and mental math fluency.',
      howToPlay: 'Look closely at the grid and select all odd numbers from 1 up to 49. Successful clicks illuminate green with a checkmark. Even numbers or numbers above 50 flash red with an X and deduct 2 seconds from the clock. Find all 25 odd numbers to earn maximum stars.',
      teacherNotes: 'Ask students to pair up counters or draw dots in pairs to prove why 7 or 15 cannot be evenly split without one left over. Connect this to the alternating odd-even structure of natural numbers.',
      faq: [
        { q: 'What digits do all odd numbers end with?', a: 'All odd numbers terminate in 1, 3, 5, 7, or 9. No odd number can ever end in an even digit.' },
        { q: 'Why is 1 considered an odd number?', a: 'When 1 is divided by 2, it leaves a remainder of 1. It also cannot be grouped into pairs of two without a leftover piece.' }
      ],
      related: ['even-numbers-up-to-50', 'multiples-of-3-grid', 'prime-numbers-to-50-game']
    },
    game: {
      prompt: 'Click odd numbers up to 50',
      seconds: 50,
      pool: { type: 'range', from: 1, to: 100 },
      display: 'decimal',
      rule: { name: 'odd_up_to', params: { max: 50 } },
      allowShuffle: true
    }
  },

  // 3. Multiples of 10
  {
    slug: 'multiples-of-10-grid',
    grade: 2,
    topic: 'place-value',
    standards: ['CCSS.MATH.CONTENT.2.NBT.A.2'],
    seo: {
      title: 'Multiples of 10 Speed Grid - Skip Counting Math Game',
      metaDescription: 'Master multiples of 10 on an interactive 10x10 math grid. Click all numbers ending in zero from 10 to 100 in this classroom clicker challenge.',
      h1: 'Multiples of 10 Speed Challenge',
      intro: 'Our base-ten positional number system is built around groupings of ten. When skip counting by tens starting from zero, every resulting multiple ends with the zero digit. On this 10x10 grid, the multiples of 10 occupy the entire rightmost column. Speed-clicking these benchmark numbers reinforces place value transitions, decade numbers, and rapid mental estimation for early elementary mathematicians.',
      howToPlay: 'Identify and click all multiples of 10 between 1 and 100. Correct clicks turn green with a checkmark. Non-multiples flash red and cost 2 seconds of round time. Locate all 10 multiples of 10 to complete the challenge.',
      teacherNotes: 'Use this quick exercise to solidify mental addition and subtraction with two-digit decade numbers (e.g. 30 + 40 = 70). Emphasize how 10 tens make 100.',
      faq: [
        { q: 'How can you instantly identify a multiple of 10?', a: 'Any whole number whose ones digit is 0 is an exact multiple of 10.' },
        { q: 'What is the largest multiple of 10 under 100?', a: 'On the 1 to 100 grid, 100 is the largest multiple of 10, equal to 10 multiplied by 10.' }
      ],
      related: ['multiples-of-5-grid', 'even-numbers-up-to-50', 'factors-of-100-game']
    },
    game: {
      prompt: 'Click all multiples of 10',
      seconds: 30,
      pool: { type: 'range', from: 1, to: 100 },
      display: 'decimal',
      rule: { name: 'multiple_of', params: { factor: 10 } },
      allowShuffle: true
    }
  },

  // 4. Multiples of 5
  {
    slug: 'multiples-of-5-grid',
    grade: 2,
    topic: 'operations',
    standards: ['CCSS.MATH.CONTENT.2.NBT.A.2', 'CCSS.MATH.CONTENT.3.OA.C.7'],
    seo: {
      title: 'Multiples of 5 Speed Grid - 5s Times Table Math Game',
      metaDescription: 'Find all multiples of 5 on a 10x10 number grid. Speed-click numbers ending in 5 or 0 before the countdown runs out.',
      h1: 'Multiples of 5 Math Fluency Grid',
      intro: 'Skip counting by fives is one of the earliest multiplication milestones for young students. Multiples of 5 follow an intuitive, rhythmic pattern: their ones digit alternates continuously between 5 and 0. On a standard 10-wide hundreds board, they form two distinct vertical columns in the 5th and 10th positions. This game develops rapid visual recognition of nickels, clock minutes, and tally marks.',
      howToPlay: 'Click all numbers on the 100-grid that are multiples of 5 (ending in 5 or 0). Correct clicks turn green with checkmarks. Incorrect tiles flash red and penalize 2 seconds. Find all 20 multiples of 5 to win 3 stars.',
      teacherNotes: 'Relate this game directly to reading an analog clock, where each hour number corresponds to five elapsed minutes (e.g. 3 on the clock represents 15 minutes).',
      faq: [
        { q: 'What is the divisibility rule for 5?', a: 'A number is divisible by 5 if and only if its final digit is either 0 or 5.' },
        { q: 'How many multiples of 5 exist between 1 and 100?', a: 'There are exactly 20 multiples of 5 between 1 and 100 (10 ending in 5, and 10 ending in 0).' }
      ],
      related: ['multiples-of-10-grid', 'multiples-of-3-grid', 'factors-of-50-game']
    },
    game: {
      prompt: 'Click all multiples of 5',
      seconds: 40,
      pool: { type: 'range', from: 1, to: 100 },
      display: 'decimal',
      rule: { name: 'multiple_of', params: { factor: 5 } },
      allowShuffle: true
    }
  },

  // 5. Numbers between 25 and 50
  {
    slug: 'numbers-between-25-and-50',
    grade: 1,
    topic: 'place-value',
    standards: ['CCSS.MATH.CONTENT.1.NBT.B.3'],
    seo: {
      title: 'Numbers 25 to 50 Speed Grid - Number Range Fluency',
      metaDescription: 'Practice identifying numbers from 25 to 50 on a 100-tile chart. Build number line orientation and magnitude comparison for 1st and 2nd grade.',
      h1: 'Numbers 25 to 50 Range Grid',
      intro: 'Understanding where numbers sit along the continuous number line is vital for early spatial number sense. On a 10x10 grid, the interval between 25 and 50 spans parts of the third row down into the fifth row. In this challenge, primary students click all numbers within this specific numerical window, solidifying boundary comprehension and relative magnitude comparisons.',
      howToPlay: 'Locate and click every number starting from 25 up to and including 50. Correct clicks lock green with a checkmark. Numbers below 25 or above 50 flash red and deduct 2 seconds from the timer. Find all 26 target numbers before time expires.',
      teacherNotes: 'Use this activity to help students visualize the halfway point on a 100-chart. Discuss why 50 is half of 100 and how 25 represents one quarter.',
      faq: [
        { q: 'How many integers are between 25 and 50 inclusive?', a: 'There are 26 integers from 25 through 50 inclusive (calculated as 50 - 25 + 1 = 26).' },
        { q: 'Which tens rows contain numbers in this game?', a: 'Numbers in this range span across row 3 (numbers 25-30), row 4 (numbers 31-40), and row 5 (numbers 41-50).' }
      ],
      related: ['numbers-greater-than-75', 'multiples-of-5-grid', 'even-numbers-up-to-50']
    },
    game: {
      prompt: 'Click numbers from 25 to 50',
      seconds: 45,
      pool: { type: 'range', from: 1, to: 100 },
      display: 'decimal',
      rule: { name: 'between', params: { min: 25, max: 50 } },
      allowShuffle: true
    }
  },

  // 6. Numbers greater than 75
  {
    slug: 'numbers-greater-than-75',
    grade: 1,
    topic: 'place-value',
    standards: ['CCSS.MATH.CONTENT.1.NBT.B.3'],
    seo: {
      title: 'Numbers Greater Than 75 Speed Grid - Number Comparison',
      metaDescription: 'Find every number strictly greater than 75 on a 100-tile grid. Practice inequality symbols and magnitude comparison in a fun speed challenge.',
      h1: 'Numbers Greater Than 75 Grid',
      intro: 'Comparing numbers using magnitude and inequality relations (greater than and less than) is an essential milestone in primary mathematics. The numbers strictly greater than 75 are situated in the bottom quarter of the 100 chart, consisting of numbers 76 through 100. This game reinforces rapid evaluation of inequality boundaries on visual charts.',
      howToPlay: 'Click all numbers that are strictly greater than 75 (values 76 to 100). Correct numbers highlight green with a checkmark. Clicking 75 or any smaller number causes a red flash and a 2-second penalty. Find all 25 numbers to win.',
      teacherNotes: 'Reinforce that "greater than 75" does not include 75 itself. Review the strict inequality symbol > versus the inclusive inequality symbol >=.',
      faq: [
        { q: 'Is 75 included when finding numbers greater than 75?', a: 'No, "greater than 75" means strictly larger than 75, so the smallest valid target is 76.' },
        { q: 'How many whole numbers are greater than 75 up to 100?', a: 'There are exactly 25 integers: 76 through 100.' }
      ],
      related: ['numbers-between-25-and-50', 'multiples-of-10-grid', 'odd-numbers-up-to-50']
    },
    game: {
      prompt: 'Click all numbers greater than 75',
      seconds: 45,
      pool: { type: 'range', from: 1, to: 100 },
      display: 'decimal',
      rule: { name: 'greater_than', params: { value: 75 } },
      allowShuffle: true
    }
  },

  // 7. Multiples of 4
  {
    slug: 'multiples-of-4-grid',
    grade: 3,
    topic: 'operations',
    standards: ['CCSS.MATH.CONTENT.3.OA.C.7'],
    seo: {
      title: 'Multiples of 4 Speed Grid - 4s Multiplication Facts Game',
      metaDescription: 'Click all multiples of 4 on a 10x10 math grid. Fast multiplication facts practice and skip counting designed for 3rd grade math fluency.',
      h1: 'Multiples of 4 Speed Challenge',
      intro: 'Multiplying by 4 is equivalent to doubling a number twice. Because 4 is an even number, all of its multiples must also be even numbers. On a 100-number grid, multiples of 4 exhibit clear diagonal stair-step symmetries. This game helps 3rd grade students solidify their four-times tables, link repeated addition to multiplication, and prepare for fraction four-part divisions.',
      howToPlay: 'Scan the grid to find and click every multiple of 4 up to 100. Correct clicks highlight green with a checkmark. Odd numbers or non-multiples flash red and deduct 2 seconds from the timer. Locate all 25 multiples to complete the round.',
      teacherNotes: 'Teach the double-double strategy: to multiply any number by 4, double it once, and then double the result (e.g. 7 doubled is 14; 14 doubled is 28).',
      faq: [
        { q: 'Can a multiple of 4 ever be odd?', a: 'No, because 4 is an even number, any integer multiplied by 4 will always produce an even product.' },
        { q: 'How many multiples of 4 are between 1 and 100?', a: 'There are exactly 25 multiples of 4 in this range, since 100 divided by 4 equals 25.' }
      ],
      related: ['multiples-of-8-grid', 'multiples-of-6-grid', 'square-numbers-1-to-100']
    },
    game: {
      prompt: 'Click all multiples of 4',
      seconds: 50,
      pool: { type: 'range', from: 1, to: 100 },
      display: 'decimal',
      rule: { name: 'multiple_of', params: { factor: 4 } },
      allowShuffle: true
    }
  },

  // 8. Multiples of 6
  {
    slug: 'multiples-of-6-grid',
    grade: 3,
    topic: 'operations',
    standards: ['CCSS.MATH.CONTENT.3.OA.C.7'],
    seo: {
      title: 'Multiples of 6 Speed Grid - 6 Times Table Fluency Game',
      metaDescription: 'Find all multiples of 6 on a 10x10 number chart. Reinforce the 6 times table and divisibility rules for 2 and 3 in this fast math clicker.',
      h1: 'Multiples of 6 Fluency Grid',
      intro: 'A multiple of 6 must satisfy divisibility rules for both 2 and 3 simultaneously. This means a multiple of 6 is always an even number whose digits sum to a multiple of 3. On the 100 grid, exactly 16 numbers are multiples of 6. Mastering these values boosts multiplication speed and simplifies common factor calculations in elementary algebra.',
      howToPlay: 'Locate and select every multiple of 6 up to 100. Correct selections turn green with a checkmark. Non-multiples flash red and cost 2 seconds. Find all 16 multiples before time expires.',
      teacherNotes: 'Ask students to observe why all multiples of 6 are also multiples of 2 and 3. Have them practice verifying numbers like 78 (even, and 7 + 8 = 15, so divisible by 6).',
      faq: [
        { q: 'What is the divisibility rule for 6?', a: 'A number is divisible by 6 if it is even and the sum of its digits is divisible by 3.' },
        { q: 'What is the highest multiple of 6 under 100?', a: 'The highest multiple of 6 in this range is 96 (6 x 16 = 96).' }
      ],
      related: ['multiples-of-3-grid', 'multiples-of-12-grid', 'factors-of-36-game']
    },
    game: {
      prompt: 'Click all multiples of 6',
      seconds: 45,
      pool: { type: 'range', from: 1, to: 100 },
      display: 'decimal',
      rule: { name: 'multiple_of', params: { factor: 6 } },
      allowShuffle: true
    }
  },

  // 9. Multiples of 7
  {
    slug: 'multiples-of-7-grid',
    grade: 3,
    topic: 'operations',
    standards: ['CCSS.MATH.CONTENT.3.OA.C.7'],
    seo: {
      title: 'Multiples of 7 Speed Grid - 7s Times Tables Practice Game',
      metaDescription: 'Master the tricky 7 times table on a 10x10 math grid. Click all 14 multiples of 7 from 7 to 98 before the timer reaches zero.',
      h1: 'Multiples of 7 Speed Grid',
      intro: 'The seven-times table is widely recognized by math educators as one of the most challenging multiplication tables for elementary students to master because 7 is a prime number with few obvious digit patterns. Practicing multiples of 7 on a 10x10 grid allows students to visually map out the 14 multiples up to 98, turning abstract memorization into an intuitive visual search.',
      howToPlay: 'Click all multiples of 7 scattered across the 100-number grid. Correct clicks turn green with a checkmark. Incorrect clicks flash red and penalize 2 seconds. Find all 14 multiples of 7 to win 3 stars.',
      teacherNotes: 'Point out tricky products like 7 x 8 = 56 using the rhyme "5, 6, 7, 8: 56 is 7 times 8". Have students trace how multiples of 7 shift diagonally across the rows.',
      faq: [
        { q: 'How many multiples of 7 are between 1 and 100?', a: 'There are 14 multiples of 7 up to 100: 7, 14, 21, 28, 35, 42, 49, 56, 63, 70, 77, 84, 91, and 98.' },
        { q: 'Is 91 a prime number or a multiple of 7?', a: '91 is frequently mistaken for a prime number, but it is actually a multiple of 7 (7 x 13 = 91).' }
      ],
      related: ['multiples-of-8-grid', 'multiples-of-9-grid', 'prime-numbers-to-100-game']
    },
    game: {
      prompt: 'Click all multiples of 7',
      seconds: 45,
      pool: { type: 'range', from: 1, to: 100 },
      display: 'decimal',
      rule: { name: 'multiple_of', params: { factor: 7 } },
      allowShuffle: true
    }
  },

  // 10. Multiples of 8
  {
    slug: 'multiples-of-8-grid',
    grade: 3,
    topic: 'operations',
    standards: ['CCSS.MATH.CONTENT.3.OA.C.7'],
    seo: {
      title: 'Multiples of 8 Speed Grid - 8s Times Tables Math Clicker',
      metaDescription: 'Find all multiples of 8 on a 100-number grid. Boost 8-times table multiplication facts speed and accuracy for elementary learners.',
      h1: 'Multiples of 8 Fluency Challenge',
      intro: 'Multiplying by 8 can be conceived as doubling a number three consecutive times (double, double, and double again). All multiples of 8 are even numbers that end in 8, 6, 4, 2, or 0 in a predictable repeating cycle. In this speed clicker, students locate all 12 multiples of 8 from 8 to 96 on the hundreds board.',
      howToPlay: 'Click all multiples of 8 on the grid. Correct clicks turn green with a checkmark. Distractor clicks flash red with an X and deduct 2 seconds from your time. Spot all 12 multiples before the countdown hits zero.',
      teacherNotes: 'Encourage the double-double-double mental strategy: for 8 x 6, double 6 to 12, double 12 to 24, and double 24 to 48.',
      faq: [
        { q: 'What is the pattern of the last digits in multiples of 8?', a: 'The ones digits follow a repeating cycle: 8, 6, 4, 2, 0, then 8, 6, 4, 2, 0 again.' },
        { q: 'What is the largest multiple of 8 under 100?', a: 'The largest multiple of 8 up to 100 is 96 (8 x 12 = 96).' }
      ],
      related: ['multiples-of-4-grid', 'multiples-of-7-grid', 'factors-of-48-game']
    },
    game: {
      prompt: 'Click all multiples of 8',
      seconds: 40,
      pool: { type: 'range', from: 1, to: 100 },
      display: 'decimal',
      rule: { name: 'multiple_of', params: { factor: 8 } },
      allowShuffle: true
    }
  },

  // 11. Multiples of 9
  {
    slug: 'multiples-of-9-grid',
    grade: 3,
    topic: 'operations',
    standards: ['CCSS.MATH.CONTENT.3.OA.C.7'],
    seo: {
      title: 'Multiples of 9 Speed Grid - 9s Multiplication Finger Trick Game',
      metaDescription: 'Spot all multiples of 9 on a 100-tile grid. Practice 9s times tables and explore the fascinating digit sum patterns of nine.',
      h1: 'Multiples of 9 Math Fluency Grid',
      intro: 'Multiples of 9 possess one of the most famous patterns in arithmetic: the sum of the digits of any multiple of 9 is always equal to 9 (or a multiple of 9). Furthermore, as the tens digit increases by 1, the ones digit decreases by 1 (e.g. 18, 27, 36, 45, 54, 63, 72, 81, 90). On a 10x10 grid, multiples of 9 create a clean diagonal ray from top right toward bottom left.',
      howToPlay: 'Click all multiples of 9 from 9 to 99. Correct tiles turn green with a checkmark. Incorrect clicks flash red and subtract 2 seconds. Find all 11 multiples of 9 to finish.',
      teacherNotes: 'Demonstrate the famous digit sum trick to help students quickly verify whether any large number is divisible by 9 (for example, 99 -> 9 + 9 = 18 -> 1 + 8 = 9).',
      faq: [
        { q: 'What is the digit sum trick for 9?', a: 'Add all the digits together. If their sum is 9 (or a multiple of 9), the number is a multiple of 9.' },
        { q: 'How many multiples of 9 exist up to 100?', a: 'There are 11 multiples: 9, 18, 27, 36, 45, 54, 63, 72, 81, 90, and 99.' }
      ],
      related: ['multiples-of-3-grid', 'square-numbers-1-to-100', 'factors-of-36-game']
    },
    game: {
      prompt: 'Click all multiples of 9',
      seconds: 40,
      pool: { type: 'range', from: 1, to: 100 },
      display: 'decimal',
      rule: { name: 'multiple_of', params: { factor: 9 } },
      allowShuffle: true
    }
  },

  // 12. Multiples of 11
  {
    slug: 'multiples-of-11-grid',
    grade: 3,
    topic: 'operations',
    standards: ['CCSS.MATH.CONTENT.3.OA.C.7'],
    seo: {
      title: 'Multiples of 11 Speed Grid - Double Digit Math Clicker',
      metaDescription: 'Find all double-digit multiples of 11 from 11 to 99 on a 100-number grid. Fast-paced times table practice for 3rd and 4th grade math.',
      h1: 'Multiples of 11 Speed Challenge',
      intro: 'Under 100, multiples of 11 are instantly recognizable because they consist of repeated identical digits (11, 22, 33, 44, 55, 66, 77, 88, 99). On a 10x10 grid, these 9 numbers form a crisp diagonal line from the top-left to bottom-right. Spotting these symmetrical twin digits quickly develops visual pattern recognition and number familiarity.',
      howToPlay: 'Scan the grid to click every multiple of 11 up to 100. Correct clicks lock green with a checkmark. Non-multiples flash red and deduct 2 seconds from the clock. Find all 9 multiples to earn 3 stars.',
      teacherNotes: 'Show how multiples of 11 advance diagonally across the hundreds chart because each step increases by 10 (one row down) plus 1 (one column right).',
      faq: [
        { q: 'Why do multiples of 11 have repeated digits up to 99?', a: 'Multiplying any single-digit integer n by 11 yields 10n + n, which places n in both the tens and ones columns (e.g. 7 x 11 = 77).' },
        { q: 'How many multiples of 11 are between 1 and 100?', a: 'There are exactly 9 multiples of 11 in this range: 11, 22, 33, 44, 55, 66, 77, 88, and 99.' }
      ],
      related: ['multiples-of-12-grid', 'multiples-of-9-grid', 'prime-numbers-to-100-game']
    },
    game: {
      prompt: 'Click all multiples of 11',
      seconds: 35,
      pool: { type: 'range', from: 1, to: 100 },
      display: 'decimal',
      rule: { name: 'multiple_of', params: { factor: 11 } },
      allowShuffle: true
    }
  },

  // 13. Multiples of 12
  {
    slug: 'multiples-of-12-grid',
    grade: 3,
    topic: 'operations',
    standards: ['CCSS.MATH.CONTENT.3.OA.C.7'],
    seo: {
      title: 'Multiples of 12 Speed Grid - 12s Times Table Fluency Game',
      metaDescription: 'Find all multiples of 12 on a 100-tile math grid. Practice dozen groupings and advanced multiplication facts before time runs out.',
      h1: 'Multiples of 12 Fluency Grid',
      intro: 'The twelve times table is a crucial benchmark in measurement systems, representing hours on clock faces, inches in a foot, and items in a dozen. Multiples of 12 are numbers that can be divided evenly by both 3 and 4. Up to 100, exactly 8 multiples of 12 exist. Mastering these 8 numbers cements upper multiplication recall and prepares students for work with common denominators.',
      howToPlay: 'Find and click all multiples of 12 from 1 to 100. Correct multiples highlight green with a checkmark. Misclicks flash red and penalize 2 seconds. Find all 8 multiples of 12 before the clock expires.',
      teacherNotes: 'Connect the 12 times table to real-world units: dozens of eggs, 12 inches in a foot, and 24 hours in a day.',
      faq: [
        { q: 'What are the multiples of 12 up to 100?', a: 'The 8 multiples are 12, 24, 36, 48, 60, 72, 84, and 96.' },
        { q: 'What is a quick test for divisibility by 12?', a: 'A number is divisible by 12 if its last two digits form a multiple of 4 AND the sum of its digits is divisible by 3.' }
      ],
      related: ['multiples-of-6-grid', 'factors-of-24-game', 'factors-of-36-game']
    },
    game: {
      prompt: 'Click all multiples of 12',
      seconds: 35,
      pool: { type: 'range', from: 1, to: 100 },
      display: 'decimal',
      rule: { name: 'multiple_of', params: { factor: 12 } },
      allowShuffle: true
    }
  },

  // 14. Factors of 12
  {
    slug: 'factors-of-12-game',
    grade: 3,
    topic: 'operations',
    standards: ['CCSS.MATH.CONTENT.3.OA.B.6', 'CCSS.MATH.CONTENT.4.OA.B.4'],
    seo: {
      title: 'Factors of 12 Speed Clicker - Factor Pairs Math Game',
      metaDescription: 'Find all 6 factors of 12 on a 100-number grid. Practice division, factor pairs, and multiplication facts in this fast math game.',
      h1: 'Factors of 12 Math Challenge',
      intro: 'Factors of 12 are all the whole numbers that divide evenly into 12 without leaving any remainder. Twelve is a highly composite small number with three pairs of integer factors: 1 and 12, 2 and 6, and 3 and 4. Locating these 6 factors on a 100-number grid trains students to quickly recognize divisor relationships and simplifies future fraction work.',
      howToPlay: 'Scan the grid to find and click all 6 factors of 12. Correct clicks turn green with a checkmark. Non-factors flash red and cost 2 seconds of round time. Find all 6 factors to earn 3 stars.',
      teacherNotes: 'Have students draw rectangular arrays for 12 (1x12, 2x6, 3x4) to visualize why 12 has so many factors compared to other numbers near it.',
      faq: [
        { q: 'What are all the factors of 12?', a: 'The 6 factors of 12 are 1, 2, 3, 4, 6, and 12.' },
        { q: 'What factor pairs multiply to 12?', a: 'The factor pairs are (1, 12), (2, 6), and (3, 4).' }
      ],
      related: ['factors-of-24-game', 'factors-of-36-game', 'multiples-of-12-grid']
    },
    game: {
      prompt: 'Click all factors of 12',
      seconds: 30,
      pool: { type: 'range', from: 1, to: 100 },
      display: 'decimal',
      rule: { name: 'factor_of', params: { number: 12 } },
      allowShuffle: true
    }
  },

  // 15. Factors of 16
  {
    slug: 'factors-of-16-game',
    grade: 3,
    topic: 'operations',
    standards: ['CCSS.MATH.CONTENT.4.OA.B.4'],
    seo: {
      title: 'Factors of 16 Math Clicker - Square Number Divisors',
      metaDescription: 'Click all factors of 16 on a 100-number grid. Discover why square numbers have an odd number of factors in this math fluency challenge.',
      h1: 'Factors of 16 Math Challenge',
      intro: 'Because 16 is a perfect square (4 x 4 = 16), it possesses an odd count of factors: 1, 2, 4, 8, and 16. The repeated factor pair 4 x 4 means 4 is counted only once. In this speed game, students identify the 5 factors of 16 scattered across the 100-tile board, reinforcing power-of-two relationships and square number divisors.',
      howToPlay: 'Locate and click the 5 factors of 16. Correct factors turn green with a checkmark. Incorrect clicks flash red and penalize 2 seconds from the timer. Locate all 5 factors before time expires.',
      teacherNotes: 'Explain why square numbers always have an odd total number of factors because the middle factor pairs with itself.',
      faq: [
        { q: 'What are all the factors of 16?', a: 'The factors of 16 are 1, 2, 4, 8, and 16.' },
        { q: 'Why does 16 have an odd number of factors?', a: 'Because 16 is a square number (4 x 4), the factor 4 pairs with itself rather than a different number.' }
      ],
      related: ['square-numbers-1-to-100', 'factors-of-24-game', 'multiples-of-4-grid']
    },
    game: {
      prompt: 'Click all factors of 16',
      seconds: 30,
      pool: { type: 'range', from: 1, to: 100 },
      display: 'decimal',
      rule: { name: 'factor_of', params: { number: 16 } },
      allowShuffle: true
    }
  },

  // 16. Factors of 18
  {
    slug: 'factors-of-18-game',
    grade: 3,
    topic: 'operations',
    standards: ['CCSS.MATH.CONTENT.4.OA.B.4'],
    seo: {
      title: 'Factors of 18 Speed Grid - Multiplication Factor Pairs',
      metaDescription: 'Find all 6 factors of 18 on an interactive 10x10 math grid. Test your multiplication and division fact recall under time pressure.',
      h1: 'Factors of 18 Speed Grid',
      intro: 'The number 18 is an even composite number whose factor pairs include 1 x 18, 2 x 9, and 3 x 6. Finding all 6 factors on a 100-number grid sharpens mental division skills and reinforces multiples of 2, 3, 6, and 9. This speed fluency exercise prepares students for reducing fractions and finding greatest common factors.',
      howToPlay: 'Scan the grid to find all 6 factors of 18. Correct numbers highlight green with a checkmark. Non-factors flash red and subtract 2 seconds from your timer. Find all 6 factors to earn 3 stars.',
      teacherNotes: 'Have students organize the factors into partner pairs: (1, 18), (2, 9), (3, 6). Notice how all pairs multiply to exactly 18.',
      faq: [
        { q: 'What are the positive factors of 18?', a: 'The factors of 18 are 1, 2, 3, 6, 9, and 18.' },
        { q: 'Is 4 a factor of 18?', a: 'No, 18 divided by 4 equals 4 with a remainder of 2, so 4 is not an exact factor of 18.' }
      ],
      related: ['multiples-of-9-grid', 'factors-of-36-game', 'factors-of-12-game']
    },
    game: {
      prompt: 'Click all factors of 18',
      seconds: 30,
      pool: { type: 'range', from: 1, to: 100 },
      display: 'decimal',
      rule: { name: 'factor_of', params: { number: 18 } },
      allowShuffle: true
    }
  },

  // 17. Factors of 20
  {
    slug: 'factors-of-20-game',
    grade: 3,
    topic: 'operations',
    standards: ['CCSS.MATH.CONTENT.4.OA.B.4'],
    seo: {
      title: 'Factors of 20 Math Clicker - Division & Divisibility Practice',
      metaDescription: 'Spot all 6 factors of 20 on a 10x10 math grid. Fast-paced factor pair identification for elementary and middle school students.',
      h1: 'Factors of 20 Math Challenge',
      intro: 'Twenty is a composite number with 6 factors: 1, 2, 4, 5, 10, and 20. Its factor pairs are 1 x 20, 2 x 10, and 4 x 5. Locating these factors on a 100-number board strengthens connections between fives, tens, and evens, laying essential groundwork for percentage benchmarks (like 5%, 10%, 20%, 25%, and 50%).',
      howToPlay: 'Click all 6 factors of 20 on the 100-tile grid. Correct tiles turn green with a checkmark. Incorrect clicks flash red and deduct 2 seconds from your round clock. Locate all 6 factors before time runs out.',
      teacherNotes: 'Connect the factors of 20 to money and coins: 1 cent (pennies), 2 cents, 5 cents (nickels), 10 cents (dimes), and 20 cents.',
      faq: [
        { q: 'What are all the factors of 20?', a: 'The factors of 20 are 1, 2, 4, 5, 10, and 20.' },
        { q: 'What factor pairs equal 20?', a: 'The factor pairs are (1, 20), (2, 10), and (4, 5).' }
      ],
      related: ['multiples-of-5-grid', 'multiples-of-10-grid', 'factors-of-40-game']
    },
    game: {
      prompt: 'Click all factors of 20',
      seconds: 30,
      pool: { type: 'range', from: 1, to: 100 },
      display: 'decimal',
      rule: { name: 'factor_of', params: { number: 20 } },
      allowShuffle: true
    }
  },

  // 18. Factors of 30
  {
    slug: 'factors-of-30-game',
    grade: 4,
    topic: 'number-theory',
    standards: ['CCSS.MATH.CONTENT.4.OA.B.4'],
    seo: {
      title: 'Factors of 30 Speed Grid - Number Theory & Divisors Game',
      metaDescription: 'Find all 8 factors of 30 on a 100-tile math grid. Practice divisibility rules for 2, 3, and 5 in this fast-paced classroom math clicker.',
      h1: 'Factors of 30 Speed Challenge',
      intro: 'Thirty is the product of three distinct prime numbers: 2 x 3 x 5. Because it combines three distinct prime building blocks, it has 8 factors: 1, 2, 3, 5, 6, 10, 15, and 30. Searching for these factors across the 100-number grid teaches students to integrate multiple divisibility rules at once.',
      howToPlay: 'Scan the grid to click all 8 factors of 30. Correct clicks highlight green with a checkmark. Non-factors flash red and cost 2 seconds of timer penalty. Locate all 8 factors to finish.',
      teacherNotes: 'Highlight that 30 is divisible by 2, 3, and 5. This makes it an ideal case study for prime factorization trees (30 = 2 x 3 x 5).',
      faq: [
        { q: 'What are the 8 factors of 30?', a: 'The factors of 30 are 1, 2, 3, 5, 6, 10, 15, and 30.' },
        { q: 'What are the factor pairs of 30?', a: 'The factor pairs are (1, 30), (2, 15), (3, 10), and (5, 6).' }
      ],
      related: ['factors-of-60-game', 'common-multiples-3-and-5', 'multiples-of-5-grid']
    },
    game: {
      prompt: 'Click all factors of 30',
      seconds: 35,
      pool: { type: 'range', from: 1, to: 100 },
      display: 'decimal',
      rule: { name: 'factor_of', params: { number: 30 } },
      allowShuffle: true
    }
  },

  // 19. Factors of 36
  {
    slug: 'factors-of-36-game',
    grade: 4,
    topic: 'number-theory',
    standards: ['CCSS.MATH.CONTENT.4.OA.B.4'],
    seo: {
      title: 'Factors of 36 Speed Grid - Square Number Factors Challenge',
      metaDescription: 'Click all 9 factors of 36 on an interactive 10x10 math grid. Test factor pairs and square number divisibility before time expires.',
      h1: 'Factors of 36 Math Challenge',
      intro: 'Thirty-six is both a square number (6 x 6) and a highly composite number with 9 factors: 1, 2, 3, 4, 6, 9, 12, 18, and 36. Its factor pairs are (1, 36), (2, 18), (3, 12), (4, 9), and the square pair (6, 6). Navigating the 100-number board to find all 9 factors develops multi-step divisibility checks and algebraic number sense.',
      howToPlay: 'Find and click all 9 factors of 36. Correct clicks lock green with checkmarks. Incorrect tiles flash red and penalize 2 seconds from the clock. Find all 9 factors to complete the round.',
      teacherNotes: 'Draw a factor rainbow on the board connecting pairs: 1 to 36, 2 to 18, 3 to 12, 4 to 9, with 6 resting in the center paired with itself.',
      faq: [
        { q: 'What are all factors of 36?', a: 'The 9 factors of 36 are 1, 2, 3, 4, 6, 9, 12, 18, and 36.' },
        { q: 'Why does 36 have an odd number of factors?', a: 'Like all perfect square numbers, 36 has an odd number of divisors because 6 x 6 produces 36 without a unique partner.' }
      ],
      related: ['square-numbers-1-to-100', 'factors-of-72-game', 'multiples-of-6-grid']
    },
    game: {
      prompt: 'Click all factors of 36',
      seconds: 35,
      pool: { type: 'range', from: 1, to: 100 },
      display: 'decimal',
      rule: { name: 'factor_of', params: { number: 36 } },
      allowShuffle: true
    }
  },

  // 20. Factors of 40
  {
    slug: 'factors-of-40-game',
    grade: 4,
    topic: 'number-theory',
    standards: ['CCSS.MATH.CONTENT.4.OA.B.4'],
    seo: {
      title: 'Factors of 40 Speed Grid - Factor Pairs & Divisors Clicker',
      metaDescription: 'Find all 8 factors of 40 on a 100-number math grid. Fast multiplication and division fact recall for 4th and 5th grade learners.',
      h1: 'Factors of 40 Math Challenge',
      intro: 'Forty is an even composite number with 8 positive factors: 1, 2, 4, 5, 8, 10, 20, and 40. Its factor pairs include (1, 40), (2, 20), (4, 10), and (5, 8). Hunting for all 8 factors across the hundreds board reinforces understanding of powers of 2, multiples of 5 and 10, and divisibility tests.',
      howToPlay: 'Scan the 100-tile grid and click every factor of 40. Correct factors turn green with a checkmark. Non-factors flash red and subtract 2 seconds. Spot all 8 factors before time runs out.',
      teacherNotes: 'Remind students to check numbers in pairs. When they discover that 4 divides into 40 ten times, they immediately register both 4 and 10 as factors.',
      faq: [
        { q: 'What are all the factors of 40?', a: 'The 8 factors of 40 are 1, 2, 4, 5, 8, 10, 20, and 40.' },
        { q: 'What factor pairs multiply to 40?', a: 'The factor pairs are (1, 40), (2, 20), (4, 10), and (5, 8).' }
      ],
      related: ['factors-of-20-game', 'multiples-of-8-grid', 'multiples-of-10-grid']
    },
    game: {
      prompt: 'Click all factors of 40',
      seconds: 35,
      pool: { type: 'range', from: 1, to: 100 },
      display: 'decimal',
      rule: { name: 'factor_of', params: { number: 40 } },
      allowShuffle: true
    }
  },

  // 21. Factors of 48
  {
    slug: 'factors-of-48-game',
    grade: 4,
    topic: 'number-theory',
    standards: ['CCSS.MATH.CONTENT.4.OA.B.4'],
    seo: {
      title: 'Factors of 48 Speed Grid - Composite Number Factors Challenge',
      metaDescription: 'Locate all 10 factors of 48 on a 10x10 math grid. Deepen factor pair fluency and divisibility rules in this fast-paced math game.',
      h1: 'Factors of 48 Math Fluency Grid',
      intro: 'The number 48 is an abundant composite number featuring 10 positive factors: 1, 2, 3, 4, 6, 8, 12, 16, 24, and 48. Its factor pairs are (1, 48), (2, 24), (3, 16), (4, 12), and (6, 8). Because 48 has so many divisors, locating all 10 requires rapid mental math and thorough systematic checking of small primes.',
      howToPlay: 'Click all 10 factors of 48 on the grid. Correct clicks illuminate green with a checkmark. Incorrect clicks flash red and cost a 2-second time penalty. Find all 10 factors to win 3 stars.',
      teacherNotes: 'Use 48 to model systematic factor searching: start at 1, check 2, check 3, check 4, check 5 (fails), check 6, and stop when factors cross over at 7.',
      faq: [
        { q: 'What are all 10 factors of 48?', a: 'The factors of 48 are 1, 2, 3, 4, 6, 8, 12, 16, 24, and 48.' },
        { q: 'Why does 48 have so many factors?', a: 'Its prime factorization is 2^4 x 3. Having multiple powers of two gives it an unusually large number of divisor combinations.' }
      ],
      related: ['factors-of-24-game', 'factors-of-36-game', 'multiples-of-8-grid']
    },
    game: {
      prompt: 'Click all factors of 48',
      seconds: 40,
      pool: { type: 'range', from: 1, to: 100 },
      display: 'decimal',
      rule: { name: 'factor_of', params: { number: 48 } },
      allowShuffle: true
    }
  },

  // 22. Factors of 50
  {
    slug: 'factors-of-50-game',
    grade: 4,
    topic: 'number-theory',
    standards: ['CCSS.MATH.CONTENT.4.OA.B.4'],
    seo: {
      title: 'Factors of 50 Speed Grid - Mental Math Divisors Challenge',
      metaDescription: 'Find all 6 factors of 50 on a 100-number grid. Practice division facts and benchmark decimal/percentage connections in this math game.',
      h1: 'Factors of 50 Math Challenge',
      intro: 'Fifty is half of one hundred and possesses 6 factors: 1, 2, 5, 10, 25, and 50. Its factor pairs are (1, 50), (2, 25), and (5, 10). Finding these factors reinforces fractional halves and quarters of 100, which are invaluable for calculating percentages, money transactions, and mental math shortcuts.',
      howToPlay: 'Scan the grid to find and click the 6 factors of 50. Correct factors turn green with a checkmark. Non-factors flash red and subtract 2 seconds from the clock. Find all 6 factors to earn a perfect score.',
      teacherNotes: 'Link the factors of 50 to common percentage divisions: 50% (factor 2), 20% (factor 5), 10% (factor 10), and 4% (factor 25).',
      faq: [
        { q: 'What are all the factors of 50?', a: 'The factors of 50 are 1, 2, 5, 10, 25, and 50.' },
        { q: 'What are the factor pairs of 50?', a: 'The pairs are (1, 50), (2, 25), and (5, 10).' }
      ],
      related: ['factors-of-100-game', 'multiples-of-5-grid', 'multiples-of-10-grid']
    },
    game: {
      prompt: 'Click all factors of 50',
      seconds: 30,
      pool: { type: 'range', from: 1, to: 100 },
      display: 'decimal',
      rule: { name: 'factor_of', params: { number: 50 } },
      allowShuffle: true
    }
  },

  // 23. Factors of 60
  {
    slug: 'factors-of-60-game',
    grade: 4,
    topic: 'number-theory',
    standards: ['CCSS.MATH.CONTENT.4.OA.B.4'],
    seo: {
      title: 'Factors of 60 Speed Grid - Clock & Geometry Number Theory',
      metaDescription: 'Click all 12 factors of 60 on a 100-number grid. Explore the ancient sexagesimal base number used in clocks and angles in this speed clicker.',
      h1: 'Factors of 60 Math Challenge',
      intro: 'The number 60 was chosen by ancient Babylonian astronomers as the foundation of timekeeping and geometry (60 seconds in a minute, 60 minutes in an hour, 360 degrees in a circle) specifically because it has an extraordinary number of factors. Sixty has 12 positive divisors: 1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30, and 60. Locating all 12 factors requires comprehensive mental math across multiple times tables.',
      howToPlay: 'Locate and click all 12 factors of 60 across the 100-number grid. Correct selections lock green with a checkmark. Incorrect tiles flash red and deduct 2 seconds. Discover all 12 factors before time runs out.',
      teacherNotes: 'Share the history of 60 with students. Explain why a clock face can be divided evenly into halves, thirds, fourths, fifths, and sixths without awkward fractions.',
      faq: [
        { q: 'Why did ancient civilizations use base 60?', a: 'Because 60 can be divided evenly by 1, 2, 3, 4, 5, and 6, making division of time and trade goods exceptionally simple.' },
        { q: 'What are all 12 factors of 60?', a: 'The factors of 60 are 1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30, and 60.' }
      ],
      related: ['factors-of-30-game', 'factors-of-72-game', 'multiples-of-12-grid']
    },
    game: {
      prompt: 'Click all factors of 60',
      seconds: 45,
      pool: { type: 'range', from: 1, to: 100 },
      display: 'decimal',
      rule: { name: 'factor_of', params: { number: 60 } },
      allowShuffle: true
    }
  },

  // 24. Factors of 72
  {
    slug: 'factors-of-72-game',
    grade: 4,
    topic: 'number-theory',
    standards: ['CCSS.MATH.CONTENT.4.OA.B.4'],
    seo: {
      title: 'Factors of 72 Speed Grid - Highly Composite Divisors Challenge',
      metaDescription: 'Find all 12 factors of 72 on a 10x10 math grid. Test advanced factor pairs, multiplication facts, and division speed for 4th and 5th graders.',
      h1: 'Factors of 72 Math Challenge',
      intro: 'Seventy-two is an abundant, highly composite number with prime factorization 2^3 x 3^2. It has 12 distinct factors: 1, 2, 3, 4, 6, 8, 9, 12, 18, 24, 36, and 72. Its factor pairs are (1, 72), (2, 36), (3, 24), (4, 18), (6, 12), and (8, 9). Identifying these 12 factors on a 100-tile board represents a pinnacle of elementary factor fluency.',
      howToPlay: 'Scan the grid to click all 12 factors of 72. Correct numbers turn green with a checkmark. Distractor clicks flash red and penalize 2 seconds from the clock. Find all 12 factors to complete the challenge.',
      teacherNotes: 'Note how factor pairs converge toward the square root: the closest pair is 8 and 9, right beside the square root of 72 (~8.48).',
      faq: [
        { q: 'What are all 12 factors of 72?', a: 'The factors of 72 are 1, 2, 3, 4, 6, 8, 9, 12, 18, 24, 36, and 72.' },
        { q: 'What factor pairs equal 72?', a: 'The factor pairs are (1, 72), (2, 36), (3, 24), (4, 18), (6, 12), and (8, 9).' }
      ],
      related: ['factors-of-36-game', 'factors-of-60-game', 'multiples-of-9-grid']
    },
    game: {
      prompt: 'Click all factors of 72',
      seconds: 45,
      pool: { type: 'range', from: 1, to: 100 },
      display: 'decimal',
      rule: { name: 'factor_of', params: { number: 72 } },
      allowShuffle: true
    }
  },

  // 25. Factors of 100
  {
    slug: 'factors-of-100-game',
    grade: 4,
    topic: 'number-theory',
    standards: ['CCSS.MATH.CONTENT.4.OA.B.4'],
    seo: {
      title: 'Factors of 100 Speed Grid - Percentages & Benchmark Divisors',
      metaDescription: 'Click all 9 factors of 100 on an interactive 10x10 math grid. Master key divisor benchmarks for dollar money math and percentage calculations.',
      h1: 'Factors of 100 Math Challenge',
      intro: 'One hundred is the cornerstone of our decimal currency and percentage mathematics. Because 100 is a square number (10 x 10), it has an odd count of factors (9 in total): 1, 2, 4, 5, 10, 20, 25, 50, and 100. Spotting all 9 factors builds essential bridges between whole number division, fractions (1/4 = 25/100), and percentages.',
      howToPlay: 'Identify and click all 9 factors of 100 on the grid. Correct factors turn green with a checkmark. Incorrect clicks flash red and penalize 2 seconds. Find all 9 factors to complete the round.',
      teacherNotes: 'Directly relate the factors of 100 to United States currency: 1 cent (penny), 5 cents (nickel), 10 cents (dime), 25 cents (quarter), 50 cents (half dollar), and 100 cents (dollar).',
      faq: [
        { q: 'What are all 9 factors of 100?', a: 'The factors of 100 are 1, 2, 4, 5, 10, 20, 25, 50, and 100.' },
        { q: 'Why are factors of 100 useful in real life?', a: 'They provide the exact coin values for money and simplify common percentages like 20%, 25%, and 50%.' }
      ],
      related: ['factors-of-50-game', 'square-numbers-1-to-100', 'multiples-of-10-grid']
    },
    game: {
      prompt: 'Click all factors of 100',
      seconds: 35,
      pool: { type: 'range', from: 1, to: 100 },
      display: 'decimal',
      rule: { name: 'factor_of', params: { number: 100 } },
      allowShuffle: true
    }
  },

  // 26. Prime numbers to 50
  {
    slug: 'prime-numbers-to-50-game',
    grade: 4,
    topic: 'number-theory',
    standards: ['CCSS.MATH.CONTENT.4.OA.B.4'],
    seo: {
      title: 'Prime Numbers to 50 Speed Grid - Elementary Prime Math Game',
      metaDescription: 'Find all 15 prime numbers between 1 and 50 on a 100-tile grid. Practice prime vs composite number recognition for 4th and 5th graders.',
      h1: 'Prime Numbers Up to 50 Grid',
      intro: 'Before mastering all 25 primes up to 100, elementary students often focus on internalizing the first 15 prime numbers located between 1 and 50 (2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47). This targeted game sharpens prime recognition in a focused interval, helping students avoid common composite traps like 9, 15, 21, 27, 33, 35, and 49.',
      howToPlay: 'Click all prime numbers that are less than or equal to 50. Correct clicks highlight green with a checkmark. Composite numbers or numbers above 50 flash red and deduct 2 seconds. Find all 15 primes to earn 3 stars.',
      teacherNotes: 'Review the Sieve of Eratosthenes method with students: cross out multiples of 2, 3, 5, and 7 to reveal the remaining primes under 50.',
      faq: [
        { q: 'How many prime numbers are there up to 50?', a: 'There are exactly 15 prime numbers: 2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, and 47.' },
        { q: 'Why is 49 not a prime number?', a: '49 is a composite number because 7 multiplied by 7 equals 49 (it has three positive divisors: 1, 7, and 49).' }
      ],
      related: ['prime-numbers-to-100-game', 'odd-numbers-up-to-50', 'square-numbers-1-to-100']
    },
    game: {
      prompt: 'Click prime numbers up to 50',
      seconds: 40,
      pool: { type: 'range', from: 1, to: 100 },
      display: 'decimal',
      rule: { name: 'prime_up_to', params: { max: 50 } },
      allowShuffle: true
    }
  },

  // 27. Cube numbers 1 to 100
  {
    slug: 'cube-numbers-1-to-100',
    grade: 5,
    topic: 'number-theory',
    standards: ['CCSS.MATH.CONTENT.5.MD.C.3', 'CCSS.MATH.CONTENT.6.EE.A.1'],
    seo: {
      title: 'Cube Numbers 1 to 100 Speed Challenge - 3D Math Fluency',
      metaDescription: 'Spot all perfect cube numbers between 1 and 100 on an interactive 10x10 math grid. Learn third power exponents and 3D volume concepts.',
      h1: 'Cube Numbers 1 to 100 Grid',
      intro: 'A cube number (or perfect cube) is the result of multiplying an integer by itself three times (n x n x n = n^3). In geometry, a cube number represents the three-dimensional volume of a cube with whole-number edge lengths. Between 1 and 100, only 4 perfect cubes exist: 1 (1^3), 8 (2^3), 27 (3^3), and 64 (4^3), as the next cube 125 exceeds 100. Spotting these numbers connects exponents with volume geometry.',
      howToPlay: 'Scan the grid to find and click the 4 perfect cube numbers up to 100. Correct selections turn green with a checkmark. Non-cubes flash red and deduct 2 seconds from your timer. Find all 4 cubes to win.',
      teacherNotes: 'Use base-ten unit blocks to build physical cubes: a 1x1x1 block (1), a 2x2x2 block (8), a 3x3x3 block (27), and a 4x4x4 block (64).',
      faq: [
        { q: 'What are the perfect cubes up to 100?', a: 'The four perfect cubes are 1 (1x1x1), 8 (2x2x2), 27 (3x3x3), and 64 (4x4x4).' },
        { q: 'Why is 64 both a square number and a cube number?', a: 'Because 64 equals 8 squared (8 x 8) and also equals 4 cubed (4 x 4 x 4). In exponential notation, 2^6 = 64.' }
      ],
      related: ['square-numbers-1-to-100', 'factors-of-24-game', 'prime-numbers-to-100-game']
    },
    game: {
      prompt: 'Click all cube numbers',
      seconds: 25,
      pool: { type: 'range', from: 1, to: 100 },
      display: 'decimal',
      rule: { name: 'cube', params: {} },
      allowShuffle: true
    }
  },

  // 28. Common multiples of 2 and 3
  {
    slug: 'common-multiples-2-and-3',
    grade: 5,
    topic: 'number-theory',
    standards: ['CCSS.MATH.CONTENT.5.OA.A.2', 'CCSS.MATH.CONTENT.6.NS.B.4'],
    seo: {
      title: 'Common Multiples of 2 and 3 - LCM 6 Speed Grid',
      metaDescription: 'Find all numbers divisible by both 2 and 3 on a 100-number grid. Master least common multiples and divisibility rules in this math speed challenge.',
      h1: 'Common Multiples of 2 and 3 Grid',
      intro: 'When an integer is divisible by both 2 and 3, it must also be a multiple of their least common multiple, which is 6 (2 x 3 = 6). In this game, students identify numbers that satisfy both conditions: the number must be even and its digit sum must be divisible by 3. Finding all 16 common multiples on the 100-grid cements divisibility integration and fraction denominator mastery.',
      howToPlay: 'Click all numbers between 1 and 100 that are multiples of both 2 and 3 (multiples of 6). Correct tiles highlight green with a checkmark. Distractor clicks flash red and cost 2 seconds. Find all 16 common multiples before time expires.',
      teacherNotes: 'Have students test numbers by applying the two-step rule: first check if it is even, then sum the digits to see if 3 divides into the sum.',
      faq: [
        { q: 'What is the least common multiple (LCM) of 2 and 3?', a: 'The LCM of 2 and 3 is 6. Therefore, all common multiples of 2 and 3 are multiples of 6.' },
        { q: 'How many common multiples of 2 and 3 are under 100?', a: 'There are 16 common multiples: 6, 12, 18, 24, 30, 36, 42, 48, 54, 60, 66, 72, 78, 84, 90, and 96.' }
      ],
      related: ['common-multiples-3-and-5', 'multiples-of-6-grid', 'factors-of-24-game']
    },
    game: {
      prompt: 'Click common multiples of 2 and 3',
      seconds: 45,
      pool: { type: 'range', from: 1, to: 100 },
      display: 'decimal',
      rule: { name: 'common_multiple', params: { factors: [2, 3] } },
      allowShuffle: true
    }
  },

  // 29. Common multiples of 4 and 6
  {
    slug: 'common-multiples-4-and-6',
    grade: 5,
    topic: 'number-theory',
    standards: ['CCSS.MATH.CONTENT.6.NS.B.4'],
    seo: {
      title: 'Common Multiples of 4 and 6 - LCM 12 Math Speed Challenge',
      metaDescription: 'Click all common multiples of 4 and 6 on a 100-tile grid. Practice least common multiple (LCM) concepts and avoid the common product trap.',
      h1: 'Common Multiples of 4 and 6 Grid',
      intro: 'A common mistake students make is multiplying 4 by 6 to get 24, assuming 24 is the smallest shared multiple. In reality, because 4 and 6 share a common factor of 2, their least common multiple (LCM) is 12. Consequently, all common multiples of 4 and 6 are multiples of 12 (12, 24, 36, 48, 60, 72, 84, 96). This speed clicker teaches students to spot shared multiples efficiently.',
      howToPlay: 'Locate and click every number that is a multiple of both 4 and 6. Correct selections turn green with checkmarks. Incorrect tiles flash red and penalize 2 seconds from the clock. Find all 8 common multiples to win.',
      teacherNotes: 'Use this example to contrast multiplying two numbers (4 x 6 = 24) with finding their actual least common multiple (LCM = 12).',
      faq: [
        { q: 'Why is the LCM of 4 and 6 equal to 12 rather than 24?', a: 'Because both 4 and 6 share the prime factor 2. Using prime factors: 4 = 2^2, 6 = 2 x 3. The LCM takes the highest power of each prime: 2^2 x 3 = 12.' },
        { q: 'How many common multiples of 4 and 6 exist up to 100?', a: 'There are 8 common multiples: 12, 24, 36, 48, 60, 72, 84, and 96.' }
      ],
      related: ['common-multiples-2-and-3', 'multiples-of-12-grid', 'multiples-of-4-grid']
    },
    game: {
      prompt: 'Click common multiples of 4 and 6',
      seconds: 35,
      pool: { type: 'range', from: 1, to: 100 },
      display: 'decimal',
      rule: { name: 'common_multiple', params: { factors: [4, 6] } },
      allowShuffle: true
    }
  },

  // 30. Common multiples of 6 and 8
  {
    slug: 'common-multiples-6-and-8',
    grade: 6,
    topic: 'algebra-foundations',
    standards: ['CCSS.MATH.CONTENT.6.NS.B.4'],
    seo: {
      title: 'Common Multiples of 6 and 8 - LCM 24 Math Speed Game',
      metaDescription: 'Find all numbers divisible by both 6 and 8 on a 100-number grid. Master least common multiples for middle school algebraic reasoning.',
      h1: 'Common Multiples of 6 and 8 Grid',
      intro: 'The least common multiple of 6 and 8 is 24 (since 6 = 2 x 3 and 8 = 2^3, LCM = 2^3 x 3 = 24). Up to 100, exactly 4 numbers are common multiples of both 6 and 8: 24, 48, 72, and 96. Identifying these shared multiples trains 6th-grade students in prime factorization, algebraic reasoning, and finding common denominators for fraction operations.',
      howToPlay: 'Scan the grid to click every number that is a multiple of both 6 and 8. Correct clicks turn green with a checkmark. Incorrect clicks flash red and cost 2 seconds. Find all 4 common multiples to finish.',
      teacherNotes: 'Demonstrate prime factor Venn diagrams: put the shared factor 2 in the overlap, 3 in the 6-circle, and 2, 2 in the 8-circle. The union is 2 x 2 x 2 x 3 = 24.',
      faq: [
        { q: 'What are the common multiples of 6 and 8 up to 100?', a: 'The four common multiples are 24, 48, 72, and 96.' },
        { q: 'What is the difference between LCM and GCF?', a: 'LCM is the smallest shared multiple of two numbers (here, 24). GCF is the largest factor that divides both numbers (for 6 and 8, GCF is 2).' }
      ],
      related: ['common-multiples-4-and-6', 'multiples-of-8-grid', 'factors-of-48-game']
    },
    game: {
      prompt: 'Click common multiples of 6 and 8',
      seconds: 30,
      pool: { type: 'range', from: 1, to: 100 },
      display: 'decimal',
      rule: { name: 'common_multiple', params: { factors: [6, 8] } },
      allowShuffle: true
    }
  },

  // 31. Roman numerals multiples of 5
  {
    slug: 'roman-numerals-multiples-of-5',
    grade: 5,
    topic: 'place-value',
    standards: ['CCSS.MATH.CONTENT.5.NBT.A.1'],
    seo: {
      title: 'Roman Numerals Multiples of 5 - Ancient Numbers Math Game',
      metaDescription: 'Identify Roman numeral multiples of 5 (V, X, XV, XX... C) on an interactive 10x10 grid. Learn Roman numeral place value and symbols.',
      h1: 'Roman Numerals Multiples of 5 Grid',
      intro: 'Roman numerals represent numbers using Latin letters (I=1, V=5, X=10, L=50, C=100). In this historic math game, all 100 tiles display their values in authentic Roman numeral format. Students locate all 20 multiples of 5 from V (5) up to C (100). This activity builds multi-system number literacy and sharpens additive and subtractive Roman numeral interpretation.',
      howToPlay: 'Click every tile showing a multiple of 5 in Roman numerals (values ending in V or X, such as V, X, XV, XX, XXV... up to C). Correct clicks illuminate green with a checkmark. Non-multiples flash red and penalize 2 seconds. Find all 20 multiples to win.',
      teacherNotes: 'Review the key Roman numeral symbols: I = 1, V = 5, X = 10, L = 50, and C = 100. Discuss how the subtractive principle works in IV (4) and IX (9).',
      faq: [
        { q: 'How do you write 50 and 100 in Roman numerals?', a: '50 is written as L, and 100 is written as C.' },
        { q: 'What Roman numerals end in multiples of 5?', a: 'In Roman notation, multiples of 5 terminate with either the letter V (like XV for 15 or XXV for 25) or the letter X, L, or C.' }
      ],
      related: ['multiples-of-5-grid', 'multiples-of-10-grid', 'factors-of-100-game']
    },
    game: {
      prompt: 'Click Roman numeral multiples of 5',
      seconds: 50,
      pool: { type: 'range', from: 1, to: 100 },
      display: 'roman',
      rule: { name: 'multiple_of', params: { factor: 5 } },
      allowShuffle: true
    }
  }
];

function buildFractionPool(targetNum, targetDen) {
  const targetRatio = targetNum / targetDen;
  const items = [];
  const targets = [];
  for (let m = 1; m <= 15; m++) {
    targets.push(`${targetNum * m}/${targetDen * m}`);
  }

  const distractors = [
    '1/2', '2/3', '3/5', '4/5', '5/6', '1/6', '2/5', '3/7', '4/7', '5/7',
    '1/8', '3/8', '5/8', '7/8', '1/9', '2/9', '4/9', '5/9', '7/9', '8/9',
    '1/10', '3/10', '7/10', '9/10', '2/7', '3/4', '1/5', '5/8', '7/12', '11/12',
    '1/11', '2/11', '3/11', '4/11', '5/11', '6/11', '7/11', '8/11', '9/11', '10/11',
    '1/12', '5/12', '7/12', '11/12', '1/13', '2/13', '3/13', '4/13', '5/13', '6/13',
    '7/13', '8/13', '9/13', '10/13', '11/13', '12/13', '1/14', '3/14', '5/14', '9/14',
    '11/14', '13/14', '1/15', '2/15', '4/15', '7/15', '8/15', '11/15', '13/15', '14/15',
    '1/16', '3/16', '5/16', '7/16', '9/16', '11/16', '13/16', '15/16', '1/20', '3/20',
    '7/20', '9/20', '11/20', '13/20', '17/20', '19/20', '1/25', '2/25', '3/25', '4/25'
  ];

  let idCounter = 1;
  targets.forEach((frac) => {
    items.push({
      id: `f-${idCounter++}`,
      value: frac,
      display: frac,
      isTarget: true
    });
  });

  for (const d of distractors) {
    if (items.length >= 100) break;
    const [num, den] = d.split('/').map(Number);
    if (Math.abs(num / den - targetRatio) > 0.0001) {
      items.push({
        id: `f-${idCounter++}`,
        value: d,
        display: d,
        isTarget: false
      });
    }
  }

  let padIndex = 2;
  while (items.length < 100) {
    const val = `${padIndex}/${padIndex * 4 + 1}`;
    items.push({
      id: `f-${idCounter++}`,
      value: val,
      display: val,
      isTarget: false
    });
    padIndex++;
  }

  return items;
}

const fractionGames = [
  {
    slug: 'fractions-equivalent-to-one-third',
    grade: 4,
    topic: 'fractions',
    standards: ['CCSS.MATH.CONTENT.4.NF.A.1'],
    seo: {
      title: 'Fractions Equivalent to 1/3 Speed Grid - Visual Fraction Clicker',
      metaDescription: 'Find every fraction equivalent to one-third on an interactive 100-tile grid. Practice fraction equivalence and visual models for 4th grade.',
      h1: 'Fractions Equivalent to One-Third Grid',
      intro: 'A fraction equals one-third whenever its denominator is three times the value of its numerator (e.g. 2/6, 3/9, 4/12, 5/15). In this speed clicker game, students inspect a 100-tile board of fractions to rapidly pick out equivalent forms of 1/3, avoiding distractors like 1/4, 2/5, and 3/8. This trains fraction number sense, proportional scaling, and prepares students for adding fractions with unlike denominators.',
      howToPlay: 'Scan the 100-tile fraction grid and click each fraction that equals 1/3. Correct fractions turn green with a checkmark. Non-equivalent fractions flash red and penalize 2 seconds from the clock. Spot all 15 target fractions to earn 3 stars.',
      teacherNotes: 'Remind students of the ratio test: multiply the top number by 3. If it equals the bottom number, it simplifies to 1/3.',
      faq: [
        { q: 'What is the rule to check if a fraction equals 1/3?', a: 'Multiply the numerator by 3. If the product equals the denominator, the fraction is equivalent to 1/3 (e.g. in 4/12, 4 x 3 = 12).' },
        { q: 'Can fractions with larger numbers equal 1/3?', a: 'Yes! Fractions like 10/30, 15/45, and 33/99 all equal exactly 1/3 because both numerator and denominator share a common factor.' }
      ],
      related: ['fractions-equivalent-to-half', 'fractions-equivalent-to-one-fourth', 'fractions-equivalent-to-three-fourths']
    },
    game: {
      prompt: 'Click all fractions equivalent to 1/3',
      seconds: 55,
      pool: {
        type: 'explicit',
        items: buildFractionPool(1, 3)
      },
      display: 'fraction',
      rule: {
        name: 'equivalent_fraction',
        params: { numerator: 1, denominator: 3 }
      },
      allowShuffle: true
    }
  },
  {
    slug: 'fractions-equivalent-to-one-fourth',
    grade: 4,
    topic: 'fractions',
    standards: ['CCSS.MATH.CONTENT.4.NF.A.1'],
    seo: {
      title: 'Fractions Equivalent to 1/4 Speed Grid - Quarter Math Fluency',
      metaDescription: 'Spot all fractions equal to one-fourth (1/4) on a 100-tile grid. Master fraction simplification and proportional reasoning under time pressure.',
      h1: 'Fractions Equivalent to One-Fourth Grid',
      intro: 'One-fourth represents one part out of four equal divisions of a whole (25% or 0.25). Any fraction whose denominator is four times its numerator is equivalent to 1/4 (such as 2/8, 3/12, 4/16, and 5/20). In this interactive speed challenge, students identify equivalent fractions across 100 tiles, reinforcing multiplication relationships between numerators and denominators.',
      howToPlay: 'Examine the 10x10 fraction grid and click every fraction that simplifies to 1/4. Correct clicks lock green with a checkmark. Distractor clicks flash red and deduct 2 seconds from your clock. Find all 15 target fractions before time runs out.',
      teacherNotes: 'Connect 1/4 to a quarter dollar (25 cents out of 100 cents = 25/100 = 1/4) and 15 minutes on a 60-minute clock (15/60 = 1/4).',
      faq: [
        { q: 'How do you test if a fraction equals 1/4?', a: 'Multiply the numerator by 4. If the result matches the denominator, the fraction equals 1/4 (e.g. 5 x 4 = 20, so 5/20 = 1/4).' },
        { q: 'Why is 25/100 equal to 1/4?', a: 'Both 25 and 100 can be divided by 25: 25 divided by 25 is 1, and 100 divided by 25 is 4, yielding 1/4.' }
      ],
      related: ['fractions-equivalent-to-half', 'fractions-equivalent-to-three-fourths', 'fractions-equivalent-to-one-third']
    },
    game: {
      prompt: 'Click all fractions equivalent to 1/4',
      seconds: 55,
      pool: {
        type: 'explicit',
        items: buildFractionPool(1, 4)
      },
      display: 'fraction',
      rule: {
        name: 'equivalent_fraction',
        params: { numerator: 1, denominator: 4 }
      },
      allowShuffle: true
    }
  },
  {
    slug: 'fractions-equivalent-to-three-fourths',
    grade: 4,
    topic: 'fractions',
    standards: ['CCSS.MATH.CONTENT.4.NF.A.1'],
    seo: {
      title: 'Fractions Equivalent to 3/4 Speed Grid - Three Quarters Math Game',
      metaDescription: 'Find all fractions equal to three-fourths on an interactive 10x10 grid. Practice fraction equivalence, scaling, and decimal connections.',
      h1: 'Fractions Equivalent to Three-Fourths Grid',
      intro: 'Three-fourths represents three parts out of four equal divisions, equivalent to 75% or 0.75. When scaling 3/4 by multiplying both terms by an integer k, fractions like 6/8, 9/12, 12/16, 15/20, and 30/40 are generated. In this math clicker, 4th-grade students search a 100-tile grid for fractions equivalent to 3/4, distinguishing them from close distractors like 2/3, 4/5, and 5/6.',
      howToPlay: 'Scan the grid to find and click all fractions that equal 3/4. Correct selections turn green with checkmarks. Incorrect tiles flash red and penalize 2 seconds. Spot all 15 target fractions to earn a 3-star rating.',
      teacherNotes: 'Relate 3/4 to three quarters (75 cents out of 100 cents = 75/100 = 3/4) and 45 minutes on an analog clock (45/60 = 3/4).',
      faq: [
        { q: 'What is an easy test to see if a fraction equals 3/4?', a: 'Divide the denominator by 4, then multiply by 3. If that equals the numerator, the fraction equals 3/4 (e.g. for 12/16: 16 / 4 = 4; 4 x 3 = 12).' },
        { q: 'Is 75/100 equivalent to 3/4?', a: 'Yes! Dividing both 75 and 100 by their greatest common factor (25) simplifies the fraction to 3/4.' }
      ],
      related: ['fractions-equivalent-to-one-fourth', 'fractions-equivalent-to-half', 'fractions-equivalent-to-one-third']
    },
    game: {
      prompt: 'Click all fractions equivalent to 3/4',
      seconds: 55,
      pool: {
        type: 'explicit',
        items: buildFractionPool(3, 4)
      },
      display: 'fraction',
      rule: {
        name: 'equivalent_fraction',
        params: { numerator: 3, denominator: 4 }
      },
      allowShuffle: true
    }
  }
];

// Write out all additional games
[...additionalGames, ...fractionGames].forEach((game) => {
  const filePath = path.join(gamesDir, `${game.slug}.json`);
  fs.writeFileSync(filePath, JSON.stringify(game, null, 2), 'utf-8');
  console.log(`Generated: ${game.slug}.json`);
});
