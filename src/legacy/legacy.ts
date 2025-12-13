// @ts-nocheck
/* eslint-disable */

import { isSupabaseConfigured } from "@/supabase/client";
import { deleteImageCloud, getImageCloud, storeImageCloud } from "@/storage/images";
import {
  getAllProgressCloud,
  getProgressFromCloud,
  getTopProgressCloud,
  storeProgressCloud
} from "@/storage/rrtHistory";
import { maybeUpdateLeaderboards } from "@/leaderboards/update";
import {
  getRankIndex,
  pointsMagnitude,
  requiredPremisesForRankIndex
} from "@/rank/ranks";

export {};


/* ---- js/codec.js ---- */


const incomingCall = document.querySelector('.incoming-call');
const codec = document.querySelector('.codec');

function openCodec() {
    incomingCall.classList.remove('is-open');
    codec.classList.add('is-open');
}

function closeCodec() {
    codec.classList.remove('is-open');
}


/* ---- js/constants.js ---- */


const oldSettingsKey = "sllgms-v3";
const imageKey = 'sllgms-v3-background';
const profilesKey = 'sllgms-v3-profiles';
const selectedProfileKey = 'sllgms-v3-selected-profile';
const appStateKey = 'sllgms-v3-app-state';

let appState = {
    "score": 0,
    "rankPoints": 0,
    "questions": [],
    "backgroundImage": null,
    "gameAreaColor": "#293247CC",
    "gameAreaLightColor": "#EFEFEF",
    "isExperimentalOpen": false,
    "isLegacyOpen": false,
    "sfx": "none",
    "fastUi": true,
    "staticButtons": true,
    "darkMode": true,
};

let savedata = {
    "version": 3,
    "premises": 2,
    "timer": 30,
    "enableDistinction": true,
    "enableLinear": true,
    "linearWording": 'topunder,comparison,contains',
    "enableSyllogism": false,
    "enableAnalogy": false,
    "enableDirection": true,
    "enableDirection3D": false,
    "enableDirection4D": false,
    "enableAnchorSpace": false,
    "enableBinary": false,
    "useMeaningfulWords": false,
    "enableCarouselMode": false,
    "enableNegation": false,
    "enableMeta": false,
    "onlyAnalogy": false,
    "onlyBinary": false,
    "maxNestedBinaryDepth": 1,
    "removeNegationExplainer": false,
    "nonsenseWordLength": 3,
    "useNonsenseWords": true,
    "garbageWordLength": 3,
    "useGarbageWords": false,
    "useEmoji": false,
    "meaningfulWordNouns": true,
    "meaningfulWordAdjectives": false,
    "overrideDistinctionPremises": null,
    "overrideLinearPremises": null,
    "overrideSyllogismPremises": null,
    "offsetAnalogyPremises": null,
    "overrideBinaryPremises": null,
    "overrideDirectionPremises": null,
    "overrideDirection3DPremises": null,
    "overrideDirection4DPremises": null,
    "overrideAnchorSpacePremises": null,
    "overrideDistinctionTime": null,
    "overrideLinearTime": null,
    "overrideSyllogismTime": null,
    "offsetAnalogyTime": null,
    "overrideBinaryTime": null,
    "overrideDirectionTime": null,
    "overrideDirection3DTime": null,
    "overrideDirection4DTime": null,
    "overrideAnchorSpaceTime": null,
    "overrideDistinctionWeight": 150,
    "overrideLeftRightWeight": 100,
    "overrideTopUnderWeight": 100,
    "overrideComparisonWeight": 100,
    "overrideTemporalWeight": 100,
    "overrideContainsWeight": 100,
    "overrideSyllogismWeight": 100,
    "overrideDirectionWeight": 100,
    "overrideDirection3DWeight": 100,
    "overrideDirection4DWeight": 100,
    "overrideAnchorSpaceWeight": 100,
    "useJunkEmoji": false,
    "useVisualNoise": false,
    "visualNoiseSplits": 5,
    "space2DHardModeLevel": 0,
    "space3DHardModeLevel": 0,
    "space4DHardModeLevel": 0,
    "scrambleFactor": 80,
    "enableConnectionBranching": true,
    "enableTransformSet": true,
    "enableTransformMirror": true,
    "enableTransformScale": true,
    "enableTransformRotate": false,
    "enableTransformInterleave": false,
    "autoProgression": false,
    "autoProgressionGoal": 10,
    "autoProgressionTrailing": 20,
    "autoProgressionPercentSuccess": 90,
    "autoProgressionPercentFail": 65,
    "autoProgressionGrouping": 'separate',
    "spoilerConclusion": false,
    "enableBacktrackingLinear": false,
    "minimalMode": false,
    "dailyProgressGoal": null,
    "weeklyProgressGoal": null,
    "widePremises": false,
    "autoProgressionChange": 'auto',
    "autoProgressionTimeDrop": 5,
    "autoProgressionTimeBump": 5,
};

const defaultSavedata = structuredClone(savedata);

const compressedSettings = {
    "enableDistinction": "dist",
    "enableComparison": "comp",
    "enableSyllogism": "syll",
    "enableAnalogy": "ana",
    "enableDirection": "dir2D",
    "enableDirection3D": "dir3D",
    "enableDirection4D": "dir4D",
    "enableAnchorSpace": "anc",
    "enableBinary": "bin",
    "useMeaningfulWords": "words",
    "enableCarouselMode": "carousel",
    "enableTemporal": "temp",
    "enableNegation": "neg",
    "enableMeta": "meta",
    "onlyAnalogy": "onlyAna",
    "onlyBinary": "onlyBin",
    "maxNestedBinaryDepth": "binDepth",
    "removeNegationExplainer": "negExp",
    "nonsenseWordLength": "nonsenseLen",
    "useNonsenseWords": "nonsense",
    "garbageWordLength": "garbageLen",
    "useGarbageWords": "garbage",
    "useEmoji": "emoji",
    "meaningfulWordNouns": "nouns",
    "meaningfulWordAdjectives": "adjectives",
    "overrideDistinctionPremises": "distP",
    "overrideComparisonPremises": "compP",
    "overrideTemporalPremises": "tempP",
    "overrideSyllogismPremises": "syllP",
    "offsetAnalogyPremises": "anaP",
    "overrideBinaryPremises": "binP",
    "overrideDirectionPremises": "dir2DP",
    "overrideDirection3DPremises": "dir3DP",
    "overrideDirection4DPremises": "dir4DP",
    "overrideAnchorSpacePremises": "ancP",
    "overrideDistinctionTime": "distT",
    "overrideComparisonTime": "compT",
    "overrideTemporalTime": "tempT",
    "overrideSyllogismTime": "syllT",
    "offsetAnalogyTime": "anaT",
    "overrideBinaryTime": "binT",
    "overrideDirectionTime": "dir2DT",
    "overrideDirection3DTime": "dir3DT",
    "overrideDirection4DTime": "dir4DT",
    "overrideAnchorSpaceTime": "ancT",
    "overrideDistinctionWeight": "distW",
    "overrideLeftRightWeight": "lrW",
    "overrideTopUnderWeight": "tuW",
    "overrideComparisonWeight": "compW",
    "overrideTemporalWeight": "tempW",
    "overrideContainsWeight": "contW",
    "overrideSyllogismWeight": "syllW",
    "overrideDirectionWeight": "dir2DW",
    "overrideDirection3DWeight": "dir3DW",
    "overrideDirection4DWeight": "dir4DW",
    "overrideAnchorSpaceWeight": "ancW",
    "useJunkEmoji": "junk",
    "useVisualNoise": "vnoise",
    "visualNoiseSplits": "vsplits",
    "space2DHardModeLevel": "transform2D",
    "space3DHardModeLevel": "transform3D",
    "space4DHardModeLevel": "transform4D",
    "scrambleFactor": "scrambleF",
    "enableConnectionBranching": "branch",
    "enableTransformSet": "tset",
    "enableTransformMirror": "tMirror",
    "enableTransformScale": "tScale",
    "enableTransformRotate": "tRotate",
    "enableTransformInterleave": "tInterleave",
    "autoProgression": "auto",
    "autoProgressionGoal": "goal",
    "autoProgressionTrailing": "autoT",
    "autoProgressionPercentSuccess": "autoS",
    "autoProgressionPercentFail": "autoF",
    "autoProgressionGrouping": 'autoG',
    "autoProgressionChange": 'autoC',
    "autoProgressionTimeDrop": 'autoTD',
    "autoProgressionTimeBump": 'autoTB',
    "spoilerConclusion": "spoiler",
    "enableBacktrackingComparison": "backC",
    "enableBacktrackingTemporal": "backT",
    "enableLinear": "lin",
    "linearWording": 'linW',
    "overrideLinearPremises": "linP",
    "overrideLinearTime": "linT",
    "enableBacktrackingLinear": "backL",
    "minimalMode": "min",
    "dailyProgressGoal": "dGoal",
    "weeklyProgressGoal": "wGoal",
    "widePremises": "wide",
};

const keySettingMap = {
    "p-1": "enableDistinction",
    "p-1-premises": "overrideDistinctionPremises",
    "p-1-time": "overrideDistinctionTime",
    "p-2": "enableLinear",
    "p-2-premises": "overrideLinearPremises",
    "p-2-time": "overrideLinearTime",
    "p-3": "enableSyllogism",
    "p-3-premises": "overrideSyllogismPremises",
    "p-3-time": "overrideSyllogismTime",
    "p-4": "enableAnalogy",
    "p-4-premises": "offsetAnalogyPremises",
    "p-4-time": "offsetAnalogyTime",
    "p-5": "premises",
    "p-6": "enableDirection",
    "p-6-premises": "overrideDirectionPremises",
    "p-6-time": "overrideDirectionTime",
    "p-7": "enableBinary",
    "p-7-premises": "overrideBinaryPremises",
    "p-7-time": "overrideBinaryTime",
    "p-8": "useMeaningfulWords",
    "p-9": "enableCarouselMode",
    "p-11": "enableNegation",
    "p-12": "enableDirection3D",
    "p-12-premises": "overrideDirection3DPremises",
    "p-12-time": "overrideDirection3DTime",
    "p-13": "enableDirection4D",
    "p-13-premises": "overrideDirection4DPremises",
    "p-13-time": "overrideDirection4DTime",
    "p-14": "onlyAnalogy",
    "p-15": "onlyBinary",
    "p-16": "enableMeta",
    "p-17": "maxNestedBinaryDepth",
    "p-18": "removeNegationExplainer",
    "p-19": "nonsenseWordLength",
    "p-20": "useNonsenseWords",
    "p-21": "useEmoji",
    "p-22": "meaningfulWordNouns",
    "p-23": "meaningfulWordAdjectives",
    "p-26": "garbageWordLength",
    "p-27": "useGarbageWords",
    "p-28": "useJunkEmoji",
    "p-29": "space2DHardModeLevel",
    "p-30": "space3DHardModeLevel",
    "p-31": "scrambleFactor",
    "p-32": "enableConnectionBranching",
    "p-33": "space4DHardModeLevel",
    "p-34": "enableTransformSet",
    "p-35": "enableTransformMirror",
    "p-36": "enableTransformScale",
    "p-37": "enableTransformRotate",
    "p-38": "useVisualNoise",
    "p-39": "visualNoiseSplits",
    "p-40": "enableTransformInterleave",
    "p-41": "autoProgression",
    "p-42": "autoProgressionGoal",
    "p-43": "enableAnchorSpace",
    "p-44-premises": "overrideAnchorSpacePremises",
    "p-45-time": "overrideAnchorSpaceTime",
    "p-46": "spoilerConclusion",
    "p-47": "enableBacktrackingLinear",
    "p-48": "minimalMode",
    "p-49": "autoProgressionTrailing",
    "p-50": "autoProgressionPercentSuccess",
    "p-51": "autoProgressionPercentFail",
    "p-52": "autoProgressionGrouping",
    "p-53": "overrideDistinctionWeight",
    "p-54": "overrideLeftRightWeight",
    "p-55": "overrideTopUnderWeight",
    "p-56": "overrideComparisonWeight",
    "p-57": "overrideTemporalWeight",
    "p-58": "overrideSyllogismWeight",
    "p-59": "overrideDirectionWeight",
    "p-60": "overrideDirection3DWeight",
    "p-61": "overrideDirection4DWeight",
    "p-62": "overrideAnchorSpaceWeight",
    "p-63-optional": "dailyProgressGoal",
    "p-64-optional": "weeklyProgressGoal",
    "p-65": "overrideContainsWeight",
    "p-66": "widePremises",
    "p-67": "autoProgressionChange",
    "p-68": "autoProgressionTimeDrop",
    "p-69": "autoProgressionTimeBump",
};

const legacySettings = [
    "enableDirection4D",
    "enableAnchorSpace",
    "enableBinary",
    "enableCarouselMode",
    "enableNegation",
    "enableMeta",
    "onlyAnalogy",
    "onlyBinary",
    "maxNestedBinaryDepth",
    "removeNegationExplainer",
    "offsetAnalogyPremises",
    "overrideBinaryPremises",
    "overrideDirection4DPremises",
    "overrideAnchorSpacePremises",
    "offsetAnalogyTime",
    "overrideBinaryTime",
    "overrideDirection4DTime",
    "overrideAnchorSpaceTime",
    "overrideDirection4DWeight",
    "overrideAnchorSpaceWeight",
    "space2DHardModeLevel",
    "space3DHardModeLevel",
    "space4DHardModeLevel",
    "enableTransformSet",
    "enableTransformMirror",
    "enableTransformScale",
    "enableTransformRotate",
    "enableTransformInterleave",
];

const meaningfulWords = {
    nouns: [
        "People",
        "History",
        "Way",
        "Art",
        "World",
        "Information",
        "Map",
        "Two",
        "Family",
        "Government",
        "Health",
        "System",
        "Computer",
        "Meat",
        "Year",
        "Thanks",
        "Music",
        "Person",
        "Reading",
        "Method",
        "Data",
        "Food",
        "Understanding",
        "Theory",
        "Law",
        "Bird",
        "Literature",
        "Problem",
        "Software",
        "Control",
        "Knowledge",
        "Power",
        "Ability",
        "Economics",
        "Love",
        "Internet",
        "Television",
        "Science",
        "Library",
        "Nature",
        "Fact",
        "Product",
        "Idea",
        "Temperature",
        "Investment",
        "Area",
        "Society",
        "Activity",
        "Story",
        "Industry",
        "Media",
        "Thing",
        "Oven",
        "Community",
        "Definition",
        "Safety",
        "Quality",
        "Development",
        "Language",
        "Management",
        "Player",
        "Variety",
        "Video",
        "Week",
        "Security",
        "Country",
        "Exam",
        "Movie",
        "Organization",
        "Equipment",
        "Physics",
        "Analysis",
        "Policy",
        "Series",
        "Thought",
        "Basis",
        "Boyfriend",
        "Direction",
        "Strategy",
        "Technology",
        "Army",
        "Camera",
        "Freedom",
        "Paper",
        "Environment",
        "Child",
        "Instance",
        "Month",
        "Truth",
        "Marketing",
        "University",
        "Writing",
        "Article",
        "Department",
        "Difference",
        "Goal",
        "News",
        "Audience",
        "Fishing",
        "Growth",
        "Income",
        "Marriage",
        "User",
        "Combination",
        "Failure",
        "Meaning",
        "Medicine",
        "Philosophy",
        "Teacher",
        "Communication",
        "Night",
        "Chemistry",
        "Disease",
        "Disk",
        "Energy",
        "Nation",
        "Road",
        "Role",
        "Soup",
        "Advertising",
        "Location",
        "Success",
        "Addition",
        "Apartment",
        "Education",
        "Math",
        "Moment",
        "Painting",
        "Politics",
        "Attention",
        "Decision",
        "Event",
        "Property",
        "Shopping",
        "Student",
        "Wood",
        "Competition",
        "Distribution",
        "Entertainment",
        "Office",
        "Population",
        "President",
        "Unit",
        "Category",
        "Cigarette",
        "Context",
        "Introduction",
        "Opportunity",
        "Performance",
        "Driver",
        "Flight",
        "Length",
        "Magazine",
        "Newspaper",
        "Relationship",
        "Teaching",
        "Cell",
        "Dealer",
        "Finding",
        "Lake",
        "Member",
        "Message",
        "Phone",
        "Scene",
        "Appearance",
        "Association",
        "Concept",
        "Customer",
        "Death",
        "Discussion",
        "Housing",
        "Inflation",
        "Insurance",
        "Mood",
        "Woman",
        "Advice",
        "Blood",
        "Effort",
        "Expression",
        "Importance",
        "Opinion",
        "Payment",
        "Reality",
        "Responsibility",
        "Situation",
        "Skill",
        "Statement",
        "Wealth",
        "Application",
        "City",
        "County",
        "Depth",
        "Estate",
        "Foundation",
        "Grandmother",
        "Heart",
        "Perspective",
        "Photo",
        "Recipe",
        "Studio",
        "Topic",
        "Collection",
        "Depression",
        "Imagination",
        "Passion",
        "Percentage",
        "Resource",
        "Setting",
        "Ad",
        "Agency",
        "College",
        "Connection",
        "Criticism",
        "Debt",
        "Description",
        "Memory",
        "Patience",
        "Secretary",
        "Solution",
        "Administration",
        "Aspect",
        "Attitude",
        "Director",
        "Personality",
        "Psychology",
        "Recommendation",
        "Response",
        "Selection",
        "Storage",
        "Version",
        "Alcohol",
        "Argument",
        "Complaint",
        "Contract",
        "Emphasis",
        "Highway",
        "Loss",
        "Membership",
        "Possession",
        "Preparation",
        "Steak",
        "Union",
        "Agreement",
        "Cancer",
        "Currency",
        "Employment",
        "Engineering",
        "Entry",
        "Interaction",
        "Mixture",
        "Preference",
        "Region",
        "Republic",
        "Tradition",
        "Virus",
        "Actor",
        "Classroom",
        "Delivery",
        "Device",
        "Difficulty",
        "Drama",
        "Election",
        "Engine",
        "Football",
        "Guidance",
        "Hotel",
        "Owner",
        "Priority",
        "Protection",
        "Suggestion",
        "Tension",
        "Variation",
        "Anxiety",
        "Atmosphere",
        "Awareness",
        "Bath",
        "Bread",
        "Candidate",
        "Climate",
        "Comparison",
        "Confusion",
        "Construction",
        "Elevator",
        "Emotion",
        "Employee",
        "Employer",
        "Guest",
        "Height",
        "Leadership",
        "Mall",
        "Manager",
        "Operation",
        "Recording",
        "Sample",
        "Transportation",
        "Charity",
        "Cousin",
        "Disaster",
        "Editor",
        "Efficiency",
        "Excitement",
        "Extent",
        "Feedback",
        "Guitar",
        "Homework",
        "Leader",
        "Mom",
        "Outcome",
        "Permission",
        "Presentation",
        "Promotion",
        "Reflection",
        "Refrigerator",
        "Resolution",
        "Revenue",
        "Session",
        "Singer",
        "Tennis",
        "Basket",
        "Bonus",
        "Cabinet",
        "Childhood",
        "Church",
        "Clothes",
        "Coffee",
        "Dinner",
        "Drawing",
        "Hair",
        "Hearing",
        "Initiative",
        "Judgment",
        "Lab",
        "Measurement",
        "Mode",
        "Mud",
        "Orange",
        "Poetry",
        "Police",
        "Possibility",
        "Procedure",
        "Queen",
        "Ratio",
        "Relation",
        "Restaurant",
        "Satisfaction",
        "Sector",
        "Signature",
        "Significance",
        "Song",
        "Tooth",
        "Town",
        "Vehicle",
        "Volume",
        "Wife",
        "Accident",
        "Airport",
        "Appointment",
        "Arrival",
        "Assumption",
        "Baseball",
        "Chapter",
        "Committee",
        "Conversation",
        "Database",
        "Enthusiasm",
        "Error",
        "Explanation",
        "Farmer",
        "Gate",
        "Girl",
        "Hall",
        "Historian",
        "Hospital",
        "Injury",
        "Instruction",
        "Maintenance",
        "Manufacturer",
        "Meal",
        "Perception",
        "Pie",
        "Poem",
        "Presence",
        "Proposal",
        "Reception",
        "Replacement",
        "Revolution",
        "River",
        "Son",
        "Speech",
        "Tea",
        "Village",
        "Warning",
        "Winner",
        "Worker",
        "Writer",
        "Assistance",
        "Breath",
        "Buyer",
        "Chest",
        "Chocolate",
        "Conclusion",
        "Contribution",
        "Cookie",
        "Courage",
        "Dad",
        "Desk",
        "Drawer",
        "Establishment",
        "Examination",
        "Garbage",
        "Grocery",
        "Honey",
        "Impression",
        "Improvement",
        "Independence",
        "Insect",
        "Inspection",
        "Inspector",
        "King",
        "Ladder",
        "Menu",
        "Penalty",
        "Piano",
        "Potato",
        "Profession",
        "Professor",
        "Quantity",
        "Reaction",
        "Requirement",
        "Salad",
        "Sister",
        "Supermarket",
        "Tongue",
        "Weakness",
        "Wedding",
        "Affair",
        "Ambition",
        "Analyst",
        "Apple",
        "Assignment",
        "Assistant",
        "Bathroom",
        "Bedroom",
        "Beer",
        "Birthday",
        "Celebration",
        "Championship",
        "Cheek",
        "Client",
        "Consequence",
        "Departure",
        "Diamond",
        "Dirt",
        "Ear",
        "Fortune",
        "Friendship",
        "Funeral",
        "Gene",
        "Girlfriend",
        "Hat",
        "Indication",
        "Intention",
        "Lady",
        "Midnight",
        "Negotiation",
        "Obligation",
        "Passenger",
        "Pizza",
        "Platform",
        "Poet",
        "Pollution",
        "Recognition",
        "Reputation",
        "Shirt",
        "Sir",
        "Speaker",
        "Stranger",
        "Surgery",
        "Sympathy",
        "Tale",
        "Throat",
        "Trainer",
        "Uncle",
        "Youth",
        "Time",
        "Work",
        "Film",
        "Water",
        "Money",
        "Example",
        "While",
        "Business",
        "Study",
        "Game",
        "Life",
        "Form",
        "Air",
        "Day",
        "Place",
        "Number",
        "Part",
        "Field",
        "Fish",
        "Back",
        "Process",
        "Heat",
        "Hand",
        "Experience",
        "Job",
        "Book",
        "End",
        "Point",
        "Type",
        "Home",
        "Economy",
        "Value",
        "Body",
        "Market",
        "Guide",
        "Interest",
        "State",
        "Radio",
        "Course",
        "Company",
        "Price",
        "Size",
        "Card",
        "List",
        "Mind",
        "Trade",
        "Line",
        "Care",
        "Group",
        "Risk",
        "Word",
        "Fat",
        "Force",
        "Key",
        "Light",
        "Training",
        "Name",
        "School",
        "Top",
        "Amount",
        "Level",
        "Order",
        "Practice",
        "Research",
        "Sense",
        "Service",
        "Piece",
        "Web",
        "Boss",
        "Sport",
        "Fun",
        "House",
        "Page",
        "Term",
        "Test",
        "Answer",
        "Sound",
        "Focus",
        "Matter",
        "Kind",
        "Soil",
        "Board",
        "Oil",
        "Picture",
        "Access",
        "Garden",
        "Range",
        "Rate",
        "Reason",
        "Future",
        "Site",
        "Demand",
        "Exercise",
        "Image",
        "Case",
        "Cause",
        "Coast",
        "Action",
        "Age",
        "Bad",
        "Boat",
        "Record",
        "Result",
        "Section",
        "Building",
        "Mouse",
        "Cash",
        "Class",
        "Nothing",
        "Period",
        "Plan",
        "Store",
        "Tax",
        "Side",
        "Subject",
        "Space",
        "Rule",
        "Stock",
        "Weather",
        "Chance",
        "Figure",
        "Man",
        "Model",
        "Source",
        "Beginning",
        "Earth",
        "Program",
        "Chicken",
        "Design",
        "Feature",
        "Head",
        "Material",
        "Purpose",
        "Question",
        "Rock",
        "Salt",
        "Act",
        "Birth",
        "Car",
        "Dog",
        "Object",
        "Scale",
        "Sun",
        "Note",
        "Profit",
        "Rent",
        "Speed",
        "Style",
        "War",
        "Bank",
        "Craft",
        "Half",
        "Inside",
        "Outside",
        "Standard",
        "Bus",
        "Exchange",
        "Eye",
        "Fire",
        "Position",
        "Pressure",
        "Stress",
        "Advantage",
        "Benefit",
        "Box",
        "Frame",
        "Issue",
        "Step",
        "Cycle",
        "Face",
        "Item",
        "Metal",
        "Paint",
        "Review",
        "Room",
        "Screen",
        "Structure",
        "View",
        "Account",
        "Ball",
        "Discipline",
        "Medium",
        "Share",
        "Balance",
        "Bit",
        "Black",
        "Bottom",
        "Choice",
        "Gift",
        "Impact",
        "Machine",
        "Shape",
        "Tool",
        "Wind",
        "Address",
        "Average",
        "Career",
        "Culture",
        "Morning",
        "Pot",
        "Sign",
        "Table",
        "Task",
        "Condition",
        "Contact",
        "Credit",
        "Egg",
        "Hope",
        "Ice",
        "Network",
        "North",
        "Square",
        "Attempt",
        "Date",
        "Effect",
        "Link",
        "Post",
        "Star",
        "Voice",
        "Capital",
        "Challenge",
        "Friend",
        "Self",
        "Shot",
        "Brush",
        "Couple",
        "Debate",
        "Exit",
        "Front",
        "Function",
        "Lack",
        "Living",
        "Plant",
        "Plastic",
        "Spot",
        "Summer",
        "Taste",
        "Theme",
        "Track",
        "Wing",
        "Brain",
        "Button",
        "Click",
        "Desire",
        "Foot",
        "Gas",
        "Influence",
        "Notice",
        "Rain",
        "Wall",
        "Base",
        "Damage",
        "Distance",
        "Feeling",
        "Pair",
        "Savings",
        "Staff",
        "Sugar",
        "Target",
        "Text",
        "Animal",
        "Author",
        "Budget",
        "Discount",
        "File",
        "Ground",
        "Lesson",
        "Minute",
        "Officer",
        "Phase",
        "Reference",
        "Register",
        "Sky",
        "Stage",
        "Stick",
        "Title",
        "Trouble",
        "Bowl",
        "Bridge",
        "Campaign",
        "Character",
        "Club",
        "Edge",
        "Evidence",
        "Fan",
        "Letter",
        "Lock",
        "Maximum",
        "Novel",
        "Option",
        "Pack",
        "Park",
        "Plenty",
        "Quarter",
        "Skin",
        "Sort",
        "Weight",
        "Baby",
        "Background",
        "Carry",
        "Dish",
        "Factor",
        "Fruit",
        "Glass",
        "Joint",
        "Master",
        "Muscle",
        "Red",
        "Strength",
        "Traffic",
        "Trip",
        "Vegetable",
        "Appeal",
        "Chart",
        "Gear",
        "Ideal",
        "Kitchen",
        "Land",
        "Log",
        "Mother",
        "Net",
        "Party",
        "Principle",
        "Relative",
        "Sale",
        "Season",
        "Signal",
        "Spirit",
        "Street",
        "Tree",
        "Wave",
        "Belt",
        "Bench",
        "Commission",
        "Copy",
        "Drop",
        "Minimum",
        "Path",
        "Progress",
        "Project",
        "Sea",
        "South",
        "Status",
        "Stuff",
        "Ticket",
        "Tour",
        "Angle",
        "Blue",
        "Breakfast",
        "Confidence",
        "Daughter",
        "Degree",
        "Doctor",
        "Dot",
        "Dream",
        "Duty",
        "Essay",
        "Father",
        "Fee",
        "Finance",
        "Hour",
        "Juice",
        "Limit",
        "Luck",
        "Milk",
        "Mouth",
        "Peace",
        "Pipe",
        "Seat",
        "Stable",
        "Storm",
        "Substance",
        "Team",
        "Trick",
        "Afternoon",
        "Bat",
        "Beach",
        "Blank",
        "Catch",
        "Chain",
        "Consideration",
        "Cream",
        "Crew",
        "Detail",
        "Gold",
        "Interview",
        "Kid",
        "Mark",
        "Match",
        "Mission",
        "Pain",
        "Pleasure",
        "Score",
        "Screw",
        "Sex",
        "Shop",
        "Shower",
        "Suit",
        "Tone",
        "Window",
        "Agent",
        "Band",
        "Block",
        "Bone",
        "Calendar",
        "Cap",
        "Coat",
        "Contest",
        "Corner",
        "Court",
        "Cup",
        "District",
        "Door",
        "East",
        "Finger",
        "Garage",
        "Guarantee",
        "Hole",
        "Hook",
        "Implement",
        "Layer",
        "Lecture",
        "Lie",
        "Manner",
        "Meeting",
        "Nose",
        "Parking",
        "Partner",
        "Profile",
        "Respect",
        "Rice",
        "Routine",
        "Schedule",
        "Swimming",
        "Telephone",
        "Tip",
        "Winter",
        "Airline",
        "Bag",
        "Battle",
        "Bed",
        "Bill",
        "Bother",
        "Cake",
        "Code",
        "Curve",
        "Designer",
        "Dimension",
        "Dress",
        "Ease",
        "Emergency",
        "Evening",
        "Extension",
        "Farm",
        "Fight",
        "Gap",
        "Grade",
        "Holiday",
        "Horror",
        "Horse",
        "Host",
        "Husband",
        "Loan",
        "Mistake",
        "Mountain",
        "Nail",
        "Noise",
        "Occasion",
        "Package",
        "Patient",
        "Pause",
        "Phrase",
        "Proof",
        "Race",
        "Relief",
        "Sand",
        "Sentence",
        "Shoulder",
        "Smoke",
        "Stomach",
        "String",
        "Tourist",
        "Towel",
        "Vacation",
        "West",
        "Wheel",
        "Wine",
        "Arm",
        "Aside",
        "Associate",
        "Bet",
        "Blow",
        "Border",
        "Branch",
        "Breast",
        "Brother",
        "Buddy",
        "Bunch",
        "Chip",
        "Coach",
        "Cross",
        "Document",
        "Draft",
        "Dust",
        "Expert",
        "Floor",
        "God",
        "Golf",
        "Habit",
        "Iron",
        "Judge",
        "Knife",
        "Landscape",
        "League",
        "Mail",
        "Mess",
        "Native",
        "Opening",
        "Parent",
        "Pattern",
        "Pin",
        "Pool",
        "Pound",
        "Request",
        "Salary",
        "Shame",
        "Shelter",
        "Shoe",
        "Silver",
        "Tackle",
        "Tank",
        "Trust",
        "Assist",
        "Bake",
        "Bar",
        "Bell",
        "Bike",
        "Blame",
        "Boy",
        "Brick",
        "Chair",
        "Closet",
        "Clue",
        "Collar",
        "Comment",
        "Conference",
        "Devil",
        "Diet",
        "Fear",
        "Fuel",
        "Glove",
        "Jacket",
        "Lunch",
        "Monitor",
        "Mortgage",
        "Nurse",
        "Pace",
        "Panic",
        "Peak",
        "Plane",
        "Reward",
        "Row",
        "Sandwich",
        "Shock",
        "Spite",
        "Spray",
        "Surprise",
        "Till",
        "Transition",
        "Weekend",
        "Welcome",
        "Yard",
        "Alarm",
        "Bend",
        "Bicycle",
        "Bite",
        "Blind",
        "Bottle",
        "Cable",
        "Candle",
        "Clerk",
        "Cloud",
        "Concert",
        "Counter",
        "Flower",
        "Grandfather",
        "Harm",
        "Knee",
        "Lawyer",
        "Leather",
        "Load",
        "Mirror",
        "Neck",
        "Pension",
        "Plate",
        "Purple",
        "Ruin",
        "Ship",
        "Skirt",
        "Slice",
        "Snow",
        "Specialist",
        "Stroke",
        "Switch",
        "Trash",
        "Tune",
        "Zone",
        "Anger",
        "Award",
        "Bid",
        "Bitter",
        "Boot",
        "Bug",
        "Camp",
        "Candy",
        "Carpet",
        "Cat",
        "Champion",
        "Channel",
        "Clock",
        "Comfort",
        "Cow",
        "Crack",
        "Engineer",
        "Entrance",
        "Fault",
        "Grass",
        "Guy",
        "Hell",
        "Highlight",
        "Incident",
        "Island",
        "Joke",
        "Jury",
        "Leg",
        "Lip",
        "Mate",
        "Motor",
        "Nerve",
        "Passage",
        "Pen",
        "Pride",
        "Priest",
        "Prize",
        "Promise",
        "Resident",
        "Resort",
        "Ring",
        "Roof",
        "Rope",
        "Sail",
        "Scheme",
        "Script",
        "Sock",
        "Station",
        "Toe",
        "Tower",
        "Truck",
        "Witness",
        "A",
        "You",
        "It",
        "Can",
        "Will",
        "If",
        "One",
        "Many",
        "Most",
        "Other",
        "Use",
        "Make",
        "Good",
        "Look",
        "Help",
        "Go",
        "Great",
        "Being",
        "Few",
        "Might",
        "Still",
        "Public",
        "Read",
        "Keep",
        "Start",
        "Give",
        "Human",
        "Local",
        "General",
        "She",
        "Specific",
        "Long",
        "Play",
        "Feel",
        "High",
        "Tonight",
        "Put",
        "Common",
        "Set",
        "Change",
        "Simple",
        "Past",
        "Big",
        "Possible",
        "Particular",
        "Today",
        "Major",
        "Personal",
        "Current",
        "National",
        "Cut",
        "Natural",
        "Physical",
        "Show",
        "Try",
        "Check",
        "Second",
        "Call",
        "Move",
        "Pay",
        "Let",
        "Increase",
        "Single",
        "Individual",
        "Turn",
        "Ask",
        "Buy",
        "Guard",
        "Hold",
        "Main",
        "Offer",
        "Potential",
        "Professional",
        "International",
        "Travel",
        "Cook",
        "Alternative",
        "Following",
        "Special",
        "Working",
        "Whole",
        "Dance",
        "Excuse",
        "Cold",
        "Commercial",
        "Low",
        "Purchase",
        "Deal",
        "Primary",
        "Worth",
        "Fall",
        "Necessary",
        "Positive",
        "Produce",
        "Search",
        "Present",
        "Spend",
        "Talk",
        "Creative",
        "Tell",
        "Cost",
        "Drive",
        "Green",
        "Support",
        "Glad",
        "Remove",
        "Return",
        "Run",
        "Complex",
        "Due",
        "Effective",
        "Middle",
        "Regular",
        "Reserve",
        "Independent",
        "Leave",
        "Original",
        "Reach",
        "Rest",
        "Serve",
        "Watch",
        "Beautiful",
        "Charge",
        "Active",
        "Break",
        "Negative",
        "Safe",
        "Stay",
        "Visit",
        "Visual",
        "Affect",
        "Cover",
        "Report",
        "Rise",
        "Walk",
        "White",
        "Beyond",
        "Junior",
        "Pick",
        "Unique",
        "Anything",
        "Classic",
        "Final",
        "Lift",
        "Mix",
        "Private",
        "Stop",
        "Teach",
        "Western",
        "Concern",
        "Familiar",
        "Fly",
        "Official",
        "Broad",
        "Comfortable",
        "Gain",
        "Maybe",
        "Rich",
        "Save",
        "Stand",
        "Young",
        "Fail",
        "Heavy",
        "Hello",
        "Lead",
        "Listen",
        "Valuable",
        "Worry",
        "Handle",
        "Leading",
        "Meet",
        "Release",
        "Sell",
        "Finish",
        "Normal",
        "Press",
        "Ride",
        "Secret",
        "Spread",
        "Spring",
        "Tough",
        "Wait",
        "Brown",
        "Deep",
        "Display",
        "Flow",
        "Hit",
        "Objective",
        "Shoot",
        "Touch",
        "Cancel",
        "Chemical",
        "Cry",
        "Dump",
        "Extreme",
        "Push",
        "Conflict",
        "Eat",
        "Fill",
        "Formal",
        "Jump",
        "Kick",
        "Opposite",
        "Pass",
        "Pitch",
        "Remote",
        "Total",
        "Treat",
        "Vast",
        "Abuse",
        "Beat",
        "Burn",
        "Deposit",
        "Print",
        "Raise",
        "Sleep",
        "Somewhere",
        "Advance",
        "Anywhere",
        "Consist",
        "Dark",
        "Double",
        "Draw",
        "Equal",
        "Fix",
        "Hire",
        "Internal",
        "Join",
        "Kill",
        "Sensitive",
        "Tap",
        "Win",
        "Attack",
        "Claim",
        "Constant",
        "Drag",
        "Drink",
        "Guess",
        "Minor",
        "Pull",
        "Raw",
        "Soft",
        "Solid",
        "Wear",
        "Weird",
        "Wonder",
        "Annual",
        "Count",
        "Dead",
        "Doubt",
        "Feed",
        "Forever",
        "Impress",
        "Nobody",
        "Repeat",
        "Round",
        "Sing",
        "Slide",
        "Strip",
        "Whereas",
        "Wish",
        "Combine",
        "Command",
        "Dig",
        "Divide",
        "Equivalent",
        "Hang",
        "Hunt",
        "Initial",
        "March",
        "Mention",
        "Smell",
        "Spiritual",
        "Survey",
        "Tie",
        "Adult",
        "Brief",
        "Crazy",
        "Escape",
        "Gather",
        "Hate",
        "Prior",
        "Repair",
        "Rough",
        "Sad",
        "Scratch",
        "Sick",
        "Strike",
        "Employ",
        "External",
        "Hurt",
        "Illegal",
        "Laugh",
        "Lay",
        "Mobile",
        "Nasty",
        "Ordinary",
        "Respond",
        "Royal",
        "Senior",
        "Split",
        "Strain",
        "Struggle",
        "Swim",
        "Train",
        "Upper",
        "Wash",
        "Yellow",
        "Convert",
        "Crash",
        "Dependent",
        "Fold",
        "Funny",
        "Grab",
        "Hide",
        "Miss",
        "Permit",
        "Quote",
        "Recover",
        "Resolve",
        "Roll",
        "Sink",
        "Slip",
        "Spare",
        "Suspect",
        "Sweet",
        "Swing",
        "Twist",
        "Upstairs",
        "Usual",
        "Abroad",
        "Brave",
        "Calm",
        "Concentrate",
        "Estimate",
        "Grand",
        "Male",
        "Mine",
        "Prompt",
        "Quiet",
        "Refuse",
        "Regret",
        "Reveal",
        "Rush",
        "Shake",
        "Shift",
        "Shine",
        "Steal",
        "Suck",
        "Surround",
        "Anybody",
        "Bear",
        "Brilliant",
        "Dare",
        "Dear",
        "Delay",
        "Drunk",
        "Female",
        "Hurry",
        "Inevitable",
        "Invite",
        "Kiss",
        "Neat",
        "Pop",
        "Punch",
        "Quit",
        "Reply",
        "Representative",
        "Resist",
        "Rip",
        "Rub",
        "Silly",
        "Smile",
        "Spell",
        "Stretch",
        "Stupid",
        "Tear",
        "Temporary",
        "Tomorrow",
        "Wake",
        "Wrap",
        "Yesterday"
    ],
    adjectives: [
        "Abandoned",
        "Able",
        "Absolute",
        "Adorable",
        "Adventurous",
        "Academic",
        "Acceptable",
        "Acclaimed",
        "Accomplished",
        "Accurate",
        "Aching",
        "Acidic",
        "Acrobatic",
        "Active",
        "Actual",
        "Adept",
        "Admirable",
        "Admired",
        "Adolescent",
        "Adorable",
        "Adored",
        "Advanced",
        "Afraid",
        "Affectionate",
        "Aged",
        "Aggravating",
        "Aggressive",
        "Agile",
        "Agitated",
        "Agonizing",
        "Agreeable",
        "Ajar",
        "Alarmed",
        "Alarming",
        "Alert",
        "Alienated",
        "Alive",
        "All",
        "Altruistic",
        "Amazing",
        "Ambitious",
        "Ample",
        "Amused",
        "Amusing",
        "Anchored",
        "Ancient",
        "Angelic",
        "Angry",
        "Anguished",
        "Animated",
        "Annual",
        "Another",
        "Antique",
        "Anxious",
        "Any",
        "Apprehensive",
        "Appropriate",
        "Apt",
        "Arctic",
        "Arid",
        "Aromatic",
        "Artistic",
        "Ashamed",
        "Assured",
        "Astonishing",
        "Athletic",
        "Attached",
        "Attentive",
        "Attractive",
        "Austere",
        "Authentic",
        "Authorized",
        "Automatic",
        "Avaricious",
        "Average",
        "Aware",
        "Awesome",
        "Awful",
        "Awkward",
        "Babyish",
        "Bad",
        "Back",
        "Baggy",
        "Bare",
        "Barren",
        "Basic",
        "Beautiful",
        "Belated",
        "Beloved",
        "Beneficial",
        "Better",
        "Best",
        "Bewitched",
        "Big",
        "Big-hearted",
        "Biodegradable",
        "Bite-sized",
        "Bitter",
        "Black",
        "Black-and-white",
        "Bland",
        "Blank",
        "Blaring",
        "Bleak",
        "Blind",
        "Blissful",
        "Blond",
        "Blue",
        "Blushing",
        "Bogus",
        "Boiling",
        "Bold",
        "Bony",
        "Boring",
        "Bossy",
        "Both",
        "Bouncy",
        "Bountiful",
        "Bowed",
        "Brave",
        "Breakable",
        "Brief",
        "Bright",
        "Brilliant",
        "Brisk",
        "Broken",
        "Bronze",
        "Brown",
        "Bruised",
        "Bubbly",
        "Bulky",
        "Bumpy",
        "Buoyant",
        "Burdensome",
        "Burly",
        "Bustling",
        "Busy",
        "Buttery",
        "Buzzing",
        "Calculating",
        "Calm",
        "Candid",
        "Canine",
        "Capital",
        "Carefree",
        "Careful",
        "Careless",
        "Caring",
        "Cautious",
        "Cavernous",
        "Celebrated",
        "Charming",
        "Cheap",
        "Cheerful",
        "Cheery",
        "Chief",
        "Chilly",
        "Chubby",
        "Circular",
        "Classic",
        "Clean",
        "Clear",
        "Clear-cut",
        "Clever",
        "Close",
        "Closed",
        "Cloudy",
        "Clueless",
        "Clumsy",
        "Cluttered",
        "Coarse",
        "Cold",
        "Colorful",
        "Colorless",
        "Colossal",
        "Comfortable",
        "Common",
        "Compassionate",
        "Competent",
        "Complete",
        "Complex",
        "Complicated",
        "Composed",
        "Concerned",
        "Concrete",
        "Confused",
        "Conscious",
        "Considerate",
        "Constant",
        "Content",
        "Conventional",
        "Cooked",
        "Cool",
        "Cooperative",
        "Coordinated",
        "Corny",
        "Corrupt",
        "Costly",
        "Courageous",
        "Courteous",
        "Crafty",
        "Crazy",
        "Creamy",
        "Creative",
        "Creepy",
        "Criminal",
        "Crisp",
        "Critical",
        "Crooked",
        "Crowded",
        "Cruel",
        "Crushing",
        "Cuddly",
        "Cultivated",
        "Cultured",
        "Cumbersome",
        "Curly",
        "Curvy",
        "Cute",
        "Cylindrical",
        "Damaged",
        "Damp",
        "Dangerous",
        "Dapper",
        "Daring",
        "Darling",
        "Dark",
        "Dazzling",
        "Dead",
        "Deadly",
        "Deafening",
        "Dear",
        "Dearest",
        "Decent",
        "Decimal",
        "Decisive",
        "Deep",
        "Defenseless",
        "Defensive",
        "Defiant",
        "Deficient",
        "Definite",
        "Definitive",
        "Delayed",
        "Delectable",
        "Delicious",
        "Delightful",
        "Delirious",
        "Demanding",
        "Dense",
        "Dental",
        "Dependable",
        "Dependent",
        "Descriptive",
        "Deserted",
        "Detailed",
        "Determined",
        "Devoted",
        "Different",
        "Difficult",
        "Digital",
        "Diligent",
        "Dim",
        "Dimpled",
        "Dimwitted",
        "Direct",
        "Disastrous",
        "Discrete",
        "Disfigured",
        "Disgusting",
        "Disloyal",
        "Dismal",
        "Distant",
        "Downright",
        "Dreary",
        "Dirty",
        "Disguised",
        "Dishonest",
        "Dismal",
        "Distant",
        "Distinct",
        "Distorted",
        "Dizzy",
        "Dopey",
        "Doting",
        "Double",
        "Downright",
        "Drab",
        "Drafty",
        "Dramatic",
        "Dreary",
        "Droopy",
        "Dry",
        "Dual",
        "Dull",
        "Dutiful",
        "Each",
        "Eager",
        "Earnest",
        "Early",
        "Easy",
        "Easy-going",
        "Ecstatic",
        "Edible",
        "Educated",
        "Elaborate",
        "Elastic",
        "Elated",
        "Elderly",
        "Electric",
        "Elegant",
        "Elementary",
        "Elliptical",
        "Embarrassed",
        "Embellished",
        "Eminent",
        "Emotional",
        "Empty",
        "Enchanted",
        "Enchanting",
        "Energetic",
        "Enlightened",
        "Enormous",
        "Enraged",
        "Entire",
        "Envious",
        "Equal",
        "Equatorial",
        "Essential",
        "Esteemed",
        "Ethical",
        "Euphoric",
        "Even",
        "Evergreen",
        "Everlasting",
        "Every",
        "Evil",
        "Exalted",
        "Excellent",
        "Exemplary",
        "Exhausted",
        "Excitable",
        "Excited",
        "Exciting",
        "Exotic",
        "Expensive",
        "Experienced",
        "Expert",
        "Extraneous",
        "Extroverted",
        "Extra-large",
        "Extra-small",
        "Fabulous",
        "Failing",
        "Faint",
        "Fair",
        "Faithful",
        "Fake",
        "False",
        "Familiar",
        "Famous",
        "Fancy",
        "Fantastic",
        "Far",
        "Faraway",
        "Far-flung",
        "Far-off",
        "Fast",
        "Fat",
        "Fatal",
        "Fatherly",
        "Favorable",
        "Favorite",
        "Fearful",
        "Fearless",
        "Feisty",
        "Feline",
        "Female",
        "Feminine",
        "Few",
        "Fickle",
        "Filthy",
        "Fine",
        "Finished",
        "Firm",
        "First",
        "Firsthand",
        "Fitting",
        "Fixed",
        "Flaky",
        "Flamboyant",
        "Flashy",
        "Flat",
        "Flawed",
        "Flawless",
        "Flickering",
        "Flimsy",
        "Flippant",
        "Flowery",
        "Fluffy",
        "Fluid",
        "Flustered",
        "Focused",
        "Fond",
        "Foolhardy",
        "Foolish",
        "Forceful",
        "Forked",
        "Formal",
        "Forsaken",
        "Forthright",
        "Fortunate",
        "Fragrant",
        "Frail",
        "Frank",
        "Frayed",
        "Free",
        "French",
        "Fresh",
        "Frequent",
        "Friendly",
        "Frightened",
        "Frightening",
        "Frigid",
        "Frilly",
        "Frizzy",
        "Frivolous",
        "Front",
        "Frosty",
        "Frozen",
        "Frugal",
        "Fruitful",
        "Full",
        "Fumbling",
        "Functional",
        "Funny",
        "Fussy",
        "Fuzzy",
        "Gargantuan",
        "Gaseous",
        "General",
        "Generous",
        "Gentle",
        "Genuine",
        "Giant",
        "Giddy",
        "Gigantic",
        "Gifted",
        "Giving",
        "Glamorous",
        "Glaring",
        "Glass",
        "Gleaming",
        "Gleeful",
        "Glistening",
        "Glittering",
        "Gloomy",
        "Glorious",
        "Glossy",
        "Glum",
        "Golden",
        "Good",
        "Good-natured",
        "Gorgeous",
        "Graceful",
        "Gracious",
        "Grand",
        "Grandiose",
        "Granular",
        "Grateful",
        "Grave",
        "Gray",
        "Great",
        "Greedy",
        "Green",
        "Gregarious",
        "Grim",
        "Grimy",
        "Gripping",
        "Grizzled",
        "Gross",
        "Grotesque",
        "Grouchy",
        "Grounded",
        "Growing",
        "Growling",
        "Grown",
        "Grubby",
        "Gruesome",
        "Grumpy",
        "Guilty",
        "Gullible",
        "Gummy",
        "Hairy",
        "Half",
        "Handmade",
        "Handsome",
        "Handy",
        "Happy",
        "Happy-go-lucky",
        "Hard",
        "Hard-to-find",
        "Harmful",
        "Harmless",
        "Harmonious",
        "Harsh",
        "Hasty",
        "Hateful",
        "Haunting",
        "Healthy",
        "Heartfelt",
        "Hearty",
        "Heavenly",
        "Heavy",
        "Hefty",
        "Helpful",
        "Helpless",
        "Hidden",
        "Hideous",
        "High",
        "High-level",
        "Hilarious",
        "Hoarse",
        "Hollow",
        "Homely",
        "Honest",
        "Honorable",
        "Honored",
        "Hopeful",
        "Horrible",
        "Hospitable",
        "Hot",
        "Huge",
        "Humble",
        "Humiliating",
        "Humming",
        "Humongous",
        "Hungry",
        "Hurtful",
        "Husky",
        "Icky",
        "Icy",
        "Ideal",
        "Idealistic",
        "Identical",
        "Idle",
        "Idiotic",
        "Idolized",
        "Ignorant",
        "Ill",
        "Illegal",
        "Ill-fated",
        "Ill-informed",
        "Illiterate",
        "Illustrious",
        "Imaginary",
        "Imaginative",
        "Immaculate",
        "Immaterial",
        "Immediate",
        "Immense",
        "Impassioned",
        "Impeccable",
        "Impartial",
        "Imperfect",
        "Imperturbable",
        "Impish",
        "Impolite",
        "Important",
        "Impossible",
        "Impractical",
        "Impressionable",
        "Impressive",
        "Improbable",
        "Impure",
        "Inborn",
        "Incomparable",
        "Incompatible",
        "Incomplete",
        "Inconsequential",
        "Incredible",
        "Indelible",
        "Inexperienced",
        "Indolent",
        "Infamous",
        "Infantile",
        "Infatuated",
        "Inferior",
        "Infinite",
        "Informal",
        "Innocent",
        "Insecure",
        "Insidious",
        "Insignificant",
        "Insistent",
        "Instructive",
        "Insubstantial",
        "Intelligent",
        "Intent",
        "Intentional",
        "Interesting",
        "Internal",
        "International",
        "Intrepid",
        "Ironclad",
        "Irresponsible",
        "Irritating",
        "Itchy",
        "Jaded",
        "Jagged",
        "Jam-packed",
        "Jaunty",
        "Jealous",
        "Jittery",
        "Joint",
        "Jolly",
        "Jovial",
        "Joyful",
        "Joyous",
        "Jubilant",
        "Judicious",
        "Juicy",
        "Jumbo",
        "Junior",
        "Jumpy",
        "Juvenile",
        "Kaleidoscopic",
        "Keen",
        "Key",
        "Kind",
        "Kindhearted",
        "Kindly",
        "Klutzy",
        "Knobby",
        "Knotty",
        "Knowledgeable",
        "Knowing",
        "Known",
        "Kooky",
        "Kosher",
        "Lame",
        "Lanky",
        "Large",
        "Last",
        "Lasting",
        "Late",
        "Lavish",
        "Lawful",
        "Lazy",
        "Leading",
        "Lean",
        "Leafy",
        "Left",
        "Legal",
        "Legitimate",
        "Light",
        "Lighthearted",
        "Likable",
        "Likely",
        "Limited",
        "Limp",
        "Limping",
        "Linear",
        "Lined",
        "Liquid",
        "Little",
        "Live",
        "Lively",
        "Livid",
        "Loathsome",
        "Lone",
        "Lonely",
        "Long",
        "Long-term",
        "Loose",
        "Lopsided",
        "Lost",
        "Loud",
        "Lovable",
        "Lovely",
        "Loving",
        "Low",
        "Loyal",
        "Lucky",
        "Lumbering",
        "Luminous",
        "Lumpy",
        "Lustrous",
        "Luxurious",
        "Mad",
        "Made-up",
        "Magnificent",
        "Majestic",
        "Major",
        "Male",
        "Mammoth",
        "Married",
        "Marvelous",
        "Masculine",
        "Massive",
        "Mature",
        "Meager",
        "Mealy",
        "Mean",
        "Measly",
        "Meaty",
        "Medical",
        "Mediocre",
        "Medium",
        "Meek",
        "Mellow",
        "Melodic",
        "Memorable",
        "Menacing",
        "Merry",
        "Messy",
        "Metallic",
        "Mild",
        "Milky",
        "Mindless",
        "Miniature",
        "Minor",
        "Minty",
        "Miserable",
        "Miserly",
        "Misguided",
        "Misty",
        "Mixed",
        "Modern",
        "Modest",
        "Moist",
        "Monstrous",
        "Monthly",
        "Monumental",
        "Moral",
        "Mortified",
        "Motherly",
        "Motionless",
        "Mountainous",
        "Muddy",
        "Muffled",
        "Multicolored",
        "Mundane",
        "Murky",
        "Mushy",
        "Musty",
        "Muted",
        "Mysterious",
        "Naive",
        "Narrow",
        "Nasty",
        "Natural",
        "Naughty",
        "Nautical",
        "Near",
        "Neat",
        "Necessary",
        "Needy",
        "Negative",
        "Neglected",
        "Negligible",
        "Neighboring",
        "Nervous",
        "New",
        "Next",
        "Nice",
        "Nifty",
        "Nimble",
        "Nippy",
        "Nocturnal",
        "Noisy",
        "Nonstop",
        "Normal",
        "Notable",
        "Noted",
        "Noteworthy",
        "Novel",
        "Noxious",
        "Numb",
        "Nutritious",
        "Nutty",
        "Obedient",
        "Obese",
        "Oblong",
        "Oily",
        "Oblong",
        "Obvious",
        "Occasional",
        "Odd",
        "Oddball",
        "Offbeat",
        "Offensive",
        "Official",
        "Old",
        "Old-fashioned",
        "Only",
        "Open",
        "Optimal",
        "Optimistic",
        "Opulent",
        "Orange",
        "Orderly",
        "Organic",
        "Ornate",
        "Ornery",
        "Ordinary",
        "Original",
        "Other",
        "Our",
        "Outlying",
        "Outgoing",
        "Outlandish",
        "Outrageous",
        "Outstanding",
        "Oval",
        "Overcooked",
        "Overdue",
        "Overjoyed",
        "Overlooked",
        "Palatable",
        "Pale",
        "Paltry",
        "Parallel",
        "Parched",
        "Partial",
        "Passionate",
        "Past",
        "Pastel",
        "Peaceful",
        "Peppery",
        "Perfect",
        "Perfumed",
        "Periodic",
        "Perky",
        "Personal",
        "Pertinent",
        "Pesky",
        "Pessimistic",
        "Petty",
        "Phony",
        "Physical",
        "Piercing",
        "Pink",
        "Pitiful",
        "Plain",
        "Plaintive",
        "Plastic",
        "Playful",
        "Pleasant",
        "Pleased",
        "Pleasing",
        "Plump",
        "Plush",
        "Polished",
        "Polite",
        "Political",
        "Pointed",
        "Pointless",
        "Poised",
        "Poor",
        "Popular",
        "Portly",
        "Posh",
        "Positive",
        "Possible",
        "Potable",
        "Powerful",
        "Powerless",
        "Practical",
        "Precious",
        "Present",
        "Prestigious",
        "Pretty",
        "Precious",
        "Previous",
        "Pricey",
        "Prickly",
        "Primary",
        "Prime",
        "Pristine",
        "Private",
        "Prize",
        "Probable",
        "Productive",
        "Profitable",
        "Profuse",
        "Proper",
        "Proud",
        "Prudent",
        "Punctual",
        "Pungent",
        "Puny",
        "Pure",
        "Purple",
        "Pushy",
        "Putrid",
        "Puzzled",
        "Puzzling",
        "Quaint",
        "Qualified",
        "Quarrelsome",
        "Quarterly",
        "Queasy",
        "Querulous",
        "Questionable",
        "Quick",
        "Quick-witted",
        "Quiet",
        "Quintessential",
        "Quirky",
        "Quixotic",
        "Quizzical",
        "Radiant",
        "Ragged",
        "Rapid",
        "Rare",
        "Rash",
        "Raw",
        "Recent",
        "Reckless",
        "Rectangular",
        "Ready",
        "Real",
        "Realistic",
        "Reasonable",
        "Red",
        "Reflecting",
        "Regal",
        "Regular",
        "Reliable",
        "Relieved",
        "Remarkable",
        "Remorseful",
        "Remote",
        "Repentant",
        "Required",
        "Respectful",
        "Responsible",
        "Repulsive",
        "Revolving",
        "Rewarding",
        "Rich",
        "Rigid",
        "Right",
        "Ringed",
        "Ripe",
        "Roasted",
        "Robust",
        "Rosy",
        "Rotating",
        "Rotten",
        "Rough",
        "Round",
        "Rowdy",
        "Royal",
        "Rubbery",
        "Rundown",
        "Ruddy",
        "Rude",
        "Runny",
        "Rural",
        "Rusty",
        "Sad",
        "Safe",
        "Salty",
        "Same",
        "Sandy",
        "Sane",
        "Sarcastic",
        "Sardonic",
        "Satisfied",
        "Scaly",
        "Scarce",
        "Scared",
        "Scary",
        "Scented",
        "Scholarly",
        "Scientific",
        "Scornful",
        "Scratchy",
        "Scrawny",
        "Second",
        "Secondary",
        "Second-hand",
        "Secret",
        "Self-assured",
        "Self-reliant",
        "Selfish",
        "Sentimental",
        "Separate",
        "Serene",
        "Serious",
        "Serpentine",
        "Several",
        "Severe",
        "Shabby",
        "Shadowy",
        "Shady",
        "Shallow",
        "Shameful",
        "Shameless",
        "Sharp",
        "Shimmering",
        "Shiny",
        "Shocked",
        "Shocking",
        "Shoddy",
        "Short",
        "Short-term",
        "Showy",
        "Shrill",
        "Shy",
        "Sick",
        "Silent",
        "Silky",
        "Silly",
        "Silver",
        "Similar",
        "Simple",
        "Simplistic",
        "Sinful",
        "Single",
        "Sizzling",
        "Skeletal",
        "Skinny",
        "Sleepy",
        "Slight",
        "Slim",
        "Slimy",
        "Slippery",
        "Slow",
        "Slushy",
        "Small",
        "Smart",
        "Smoggy",
        "Smooth",
        "Smug",
        "Snappy",
        "Snarling",
        "Sneaky",
        "Sniveling",
        "Snoopy",
        "Sociable",
        "Soft",
        "Soggy",
        "Solid",
        "Somber",
        "Some",
        "Spherical",
        "Sophisticated",
        "Sore",
        "Sorrowful",
        "Soulful",
        "Soupy",
        "Sour",
        "Spanish",
        "Sparkling",
        "Sparse",
        "Specific",
        "Spectacular",
        "Speedy",
        "Spicy",
        "Spiffy",
        "Spirited",
        "Spiteful",
        "Splendid",
        "Spotless",
        "Spotted",
        "Spry",
        "Square",
        "Squeaky",
        "Squiggly",
        "Stable",
        "Staid",
        "Stained",
        "Stale",
        "Standard",
        "Starchy",
        "Stark",
        "Starry",
        "Steep",
        "Sticky",
        "Stiff",
        "Stimulating",
        "Stingy",
        "Stormy",
        "Straight",
        "Strange",
        "Steel",
        "Strict",
        "Strident",
        "Striking",
        "Striped",
        "Strong",
        "Studious",
        "Stunning",
        "Stupendous",
        "Stupid",
        "Sturdy",
        "Stylish",
        "Subdued",
        "Submissive",
        "Substantial",
        "Subtle",
        "Suburban",
        "Sudden",
        "Sugary",
        "Sunny",
        "Super",
        "Superb",
        "Superficial",
        "Superior",
        "Supportive",
        "Sure-footed",
        "Surprised",
        "Suspicious",
        "Svelte",
        "Sweaty",
        "Sweet",
        "Sweltering",
        "Swift",
        "Sympathetic",
        "Tall",
        "Talkative",
        "Tame",
        "Tan",
        "Tangible",
        "Tart",
        "Tasty",
        "Tattered",
        "Taut",
        "Tedious",
        "Teeming",
        "Tempting",
        "Tender",
        "Tense",
        "Tepid",
        "Terrible",
        "Terrific",
        "Testy",
        "Thankful",
        "That",
        "These",
        "Thick",
        "Thin",
        "Third",
        "Thirsty",
        "This",
        "Thorough",
        "Thorny",
        "Those",
        "Thoughtful",
        "Threadbare",
        "Thrifty",
        "Thunderous",
        "Tidy",
        "Tight",
        "Timely",
        "Tinted",
        "Tiny",
        "Tired",
        "Torn",
        "Total",
        "Tough",
        "Traumatic",
        "Treasured",
        "Tremendous",
        "Tragic",
        "Trained",
        "Tremendous",
        "Triangular",
        "Tricky",
        "Trifling",
        "Trim",
        "Trivial",
        "Troubled",
        "True",
        "Trusting",
        "Trustworthy",
        "Trusty",
        "Truthful",
        "Tubby",
        "Turbulent",
        "Twin",
        "Ugly",
        "Ultimate",
        "Unacceptable",
        "Unaware",
        "Uncomfortable",
        "Uncommon",
        "Unconscious",
        "Understated",
        "Unequaled",
        "Uneven",
        "Unfinished",
        "Unfit",
        "Unfolded",
        "Unfortunate",
        "Unhappy",
        "Unhealthy",
        "Uniform",
        "Unimportant",
        "Unique",
        "United",
        "Unkempt",
        "Unknown",
        "Unlawful",
        "Unlined",
        "Unlucky",
        "Unnatural",
        "Unpleasant",
        "Unrealistic",
        "Unripe",
        "Unruly",
        "Unselfish",
        "Unsightly",
        "Unsteady",
        "Unsung",
        "Untidy",
        "Untimely",
        "Untried",
        "Untrue",
        "Unused",
        "Unusual",
        "Unwelcome",
        "Unwieldy",
        "Unwilling",
        "Unwitting",
        "Unwritten",
        "Upbeat",
        "Upright",
        "Upset",
        "Urban",
        "Usable",
        "Used",
        "Useful",
        "Useless",
        "Utilized",
        "Utter",
        "Vacant",
        "Vague",
        "Vain",
        "Valid",
        "Valuable",
        "Vapid",
        "Variable",
        "Vast",
        "Velvety",
        "Venerated",
        "Vengeful",
        "Verifiable",
        "Vibrant",
        "Vicious",
        "Victorious",
        "Vigilant",
        "Vigorous",
        "Villainous",
        "Violet",
        "Violent",
        "Virtual",
        "Virtuous",
        "Visible",
        "Vital",
        "Vivacious",
        "Vivid",
        "Voluminous",
        "Wan",
        "Warlike",
        "Warm",
        "Warmhearted",
        "Warped",
        "Wary",
        "Wasteful",
        "Watchful",
        "Waterlogged",
        "Watery",
        "Wavy",
        "Wealthy",
        "Weak",
        "Weary",
        "Webbed",
        "Wee",
        "Weekly",
        "Weepy",
        "Weighty",
        "Weird",
        "Welcome",
        "Well-documented",
        "Well-groomed",
        "Well-informed",
        "Well-lit",
        "Well-made",
        "Well-off",
        "Well-to-do",
        "Well-worn",
        "Wet",
        "Which",
        "Whimsical",
        "Whirlwind",
        "Whispered",
        "White",
        "Whole",
        "Whopping",
        "Wicked",
        "Wide",
        "Wide-eyed",
        "Wiggly",
        "Wild",
        "Willing",
        "Wilted",
        "Winding",
        "Windy",
        "Winged",
        "Wiry",
        "Wise",
        "Witty",
        "Wobbly",
        "Woeful",
        "Wonderful",
        "Wooden",
        "Woozy",
        "Wordy",
        "Worldly",
        "Worn",
        "Worried",
        "Worrisome",
        "Worse",
        "Worst",
        "Worthless",
        "Worthwhile",
        "Worthy",
        "Wrathful",
        "Wretched",
        "Writhing",
        "Wrong",
        "Wry",
        "Yawning",
        "Yearly",
        "Yellow",
        "Yellowish",
        "Young",
        "Youthful",
        "Yummy",
        "Zany",
        "Zealous",
        "Zesty",
        "Zigzag"
    ]
}

const emoji = [
    "ðŸƒ",
    "ðŸ…°ï¸",
    "ðŸ…±ï¸",
    "ðŸ…¾ï¸",
    "ðŸ…¿ï¸",
    "ðŸ†Ž",
    "ðŸ†‘",
    "ðŸ†’",
    "ðŸ†“",
    "ðŸ†”",
    "ðŸ†•",
    "ðŸ†–",
    "ðŸ†—",
    "ðŸ†˜",
    "ðŸ†™",
    "ðŸ†š",
    "ðŸˆ",
    "ðŸˆ‚ï¸",
    "ðŸˆ²",
    "ðŸˆ³",
    "ðŸˆ´",
    "ðŸˆµ",
    "ðŸˆ¶",
    "ðŸˆ·ï¸",
    "ðŸˆ¸",
    "ðŸˆ¹",
    "ðŸˆº",
    "ðŸ‰",
    "ðŸ‰‘",
    "ðŸŒ€",
    "ðŸŒ",
    "ðŸŒ‚",
    "ðŸŒƒ",
    "ðŸŒ„",
    "ðŸŒ…",
    "ðŸŒ†",
    "ðŸŒ‡",
    "ðŸŒˆ",
    "ðŸŒ‰",
    "ðŸŒŠ",
    "ðŸŒ‹",
    "ðŸŒŒ",
    "ðŸŒ",
    "ðŸŒŽ",
    "ðŸŒ",
    "ðŸŒ",
    "ðŸŒ‘",
    "ðŸŒ’",
    "ðŸŒ“",
    "ðŸŒ”",
    "ðŸŒ•",
    "ðŸŒ–",
    "ðŸŒ—",
    "ðŸŒ˜",
    "ðŸŒ™",
    "ðŸŒš",
    "ðŸŒ›",
    "ðŸŒœ",
    "ðŸŒ",
    "ðŸŒž",
    "ðŸŒŸ",
    "ðŸŒ ",
    "ðŸŒ¡ï¸",
    "ðŸŒ¤ï¸",
    "ðŸŒ¥ï¸",
    "ðŸŒ¦ï¸",
    "ðŸŒ§ï¸",
    "ðŸŒ¨ï¸",
    "ðŸŒ©ï¸",
    "ðŸŒªï¸",
    "ðŸŒ«ï¸",
    "ðŸŒ¬ï¸",
    "ðŸŒ­",
    "ðŸŒ®",
    "ðŸŒ¯",
    "ðŸŒ°",
    "ðŸŒ±",
    "ðŸŒ²",
    "ðŸŒ³",
    "ðŸŒ´",
    "ðŸŒµ",
    "ðŸŒ¶ï¸",
    "ðŸŒ·",
    "ðŸŒ¸",
    "ðŸŒ¹",
    "ðŸŒº",
    "ðŸŒ»",
    "ðŸŒ¼",
    "ðŸŒ½",
    "ðŸŒ¾",
    "ðŸŒ¿",
    "ðŸ€",
    "ðŸ",
    "ðŸ‚",
    "ðŸƒ",
    "ðŸ„",
    "ðŸ…",
    "ðŸ†",
    "ðŸ‡",
    "ðŸˆ",
    "ðŸ‰",
    "ðŸŠ",
    "ðŸ‹",
    "ðŸŒ",
    "ðŸ",
    "ðŸŽ",
    "ðŸ",
    "ðŸ",
    "ðŸ‘",
    "ðŸ’",
    "ðŸ“",
    "ðŸ”",
    "ðŸ•",
    "ðŸ–",
    "ðŸ—",
    "ðŸ˜",
    "ðŸ™",
    "ðŸš",
    "ðŸ›",
    "ðŸœ",
    "ðŸ",
    "ðŸž",
    "ðŸŸ",
    "ðŸ ",
    "ðŸ¡",
    "ðŸ¢",
    "ðŸ£",
    "ðŸ¤",
    "ðŸ¥",
    "ðŸ¦",
    "ðŸ§",
    "ðŸ¨",
    "ðŸ©",
    "ðŸª",
    "ðŸ«",
    "ðŸ¬",
    "ðŸ­",
    "ðŸ®",
    "ðŸ¯",
    "ðŸ°",
    "ðŸ±",
    "ðŸ²",
    "ðŸ³",
    "ðŸ´",
    "ðŸµ",
    "ðŸ¶",
    "ðŸ·",
    "ðŸ¸",
    "ðŸ¹",
    "ðŸº",
    "ðŸ»",
    "ðŸ¼",
    "ðŸ½ï¸",
    "ðŸ¾",
    "ðŸ¿",
    "ðŸŽ€",
    "ðŸŽ",
    "ðŸŽ‚",
    "ðŸŽƒ",
    "ðŸŽ„",
    "ðŸŽ…",
    "ðŸŽ†",
    "ðŸŽ‡",
    "ðŸŽˆ",
    "ðŸŽ‰",
    "ðŸŽŠ",
    "ðŸŽ‹",
    "ðŸŽŒ",
    "ðŸŽ",
    "ðŸŽŽ",
    "ðŸŽ",
    "ðŸŽ",
    "ðŸŽ‘",
    "ðŸŽ’",
    "ðŸŽ“",
    "ðŸŽ–ï¸",
    "ðŸŽ—ï¸",
    "ðŸŽ™ï¸",
    "ðŸŽšï¸",
    "ðŸŽ›ï¸",
    "ðŸŽžï¸",
    "ðŸŽŸï¸",
    "ðŸŽ ",
    "ðŸŽ¡",
    "ðŸŽ¢",
    "ðŸŽ£",
    "ðŸŽ¤",
    "ðŸŽ¥",
    "ðŸŽ¦",
    "ðŸŽ§",
    "ðŸŽ¨",
    "ðŸŽ©",
    "ðŸŽª",
    "ðŸŽ«",
    "ðŸŽ¬",
    "ðŸŽ­",
    "ðŸŽ®",
    "ðŸŽ¯",
    "ðŸŽ°",
    "ðŸŽ±",
    "ðŸŽ²",
    "ðŸŽ³",
    "ðŸŽ´",
    "ðŸŽµ",
    "ðŸŽ¶",
    "ðŸŽ·",
    "ðŸŽ¸",
    "ðŸŽ¹",
    "ðŸŽº",
    "ðŸŽ»",
    "ðŸŽ¼",
    "ðŸŽ½",
    "ðŸŽ¾",
    "ðŸŽ¿",
    "ðŸ€",
    "ðŸ",
    "ðŸ‚",
    "ðŸƒ",
    "ðŸ…",
    "ðŸ†",
    "ðŸ‡",
    "ðŸˆ",
    "ðŸ‰",
    "ðŸŠ",
    "ðŸŒï¸",
    "ðŸï¸",
    "ðŸŽï¸",
    "ðŸ",
    "ðŸ",
    "ðŸ‘",
    "ðŸ’",
    "ðŸ“",
    "ðŸ”ï¸",
    "ðŸ•ï¸",
    "ðŸ–ï¸",
    "ðŸ—ï¸",
    "ðŸ˜ï¸",
    "ðŸ™ï¸",
    "ðŸšï¸",
    "ðŸ›ï¸",
    "ðŸœï¸",
    "ðŸï¸",
    "ðŸžï¸",
    "ðŸŸï¸",
    "ðŸ ",
    "ðŸ¡",
    "ðŸ¢",
    "ðŸ¤",
    "ðŸ¥",
    "ðŸ¦",
    "ðŸ§",
    "ðŸ¨",
    "ðŸª",
    "ðŸ«",
    "ðŸ¬",
    "ðŸ­",
    "ðŸ®",
    "ðŸ¯",
    "ðŸ°",
    "ðŸ³ï¸",
    "ðŸ´",
    "ðŸµï¸",
    "ðŸ·ï¸",
    "ðŸ¸",
    "ðŸ¹",
    "ðŸº",
    "ðŸ€",
    "ðŸ",
    "ðŸ‚",
    "ðŸƒ",
    "ðŸ„",
    "ðŸ…",
    "ðŸ†",
    "ðŸ‡",
    "ðŸˆ",
    "ðŸ‰",
    "ðŸŠ",
    "ðŸ‹",
    "ðŸŒ",
    "ðŸ",
    "ðŸŽ",
    "ðŸ",
    "ðŸ",
    "ðŸ‘",
    "ðŸ’",
    "ðŸ“",
    "ðŸ”",
    "ðŸ•",
    "ðŸ–",
    "ðŸ—",
    "ðŸ˜",
    "ðŸ™",
    "ðŸš",
    "ðŸ›",
    "ðŸœ",
    "ðŸ",
    "ðŸž",
    "ðŸŸ",
    "ðŸ ",
    "ðŸ¡",
    "ðŸ¢",
    "ðŸ£",
    "ðŸ¤",
    "ðŸ¥",
    "ðŸ¦",
    "ðŸ§",
    "ðŸ¨",
    "ðŸ©",
    "ðŸª",
    "ðŸ«",
    "ðŸ¬",
    "ðŸ­",
    "ðŸ®",
    "ðŸ¯",
    "ðŸ°",
    "ðŸ±",
    "ðŸ²",
    "ðŸ³",
    "ðŸ´",
    "ðŸµ",
    "ðŸ¶",
    "ðŸ·",
    "ðŸ¸",
    "ðŸ¹",
    "ðŸº",
    "ðŸ»",
    "ðŸ¼",
    "ðŸ½",
    "ðŸ¾",
    "ðŸ¿ï¸",
    "ðŸ‘€",
    "ðŸ‘ï¸",
    "ðŸ‘‚",
    "ðŸ‘ƒ",
    "ðŸ‘„",
    "ðŸ‘…",
    "ðŸ‘†",
    "ðŸ‘‡",
    "ðŸ‘ˆ",
    "ðŸ‘‰",
    "ðŸ‘Š",
    "ðŸ‘‹",
    "ðŸ‘Œ",
    "ðŸ‘",
    "ðŸ‘Ž",
    "ðŸ‘",
    "ðŸ‘",
    "ðŸ‘‘",
    "ðŸ‘’",
    "ðŸ‘“",
    "ðŸ‘”",
    "ðŸ‘•",
    "ðŸ‘–",
    "ðŸ‘—",
    "ðŸ‘˜",
    "ðŸ‘™",
    "ðŸ‘š",
    "ðŸ‘›",
    "ðŸ‘œ",
    "ðŸ‘",
    "ðŸ‘ž",
    "ðŸ‘Ÿ",
    "ðŸ‘ ",
    "ðŸ‘¡",
    "ðŸ‘¢",
    "ðŸ‘£",
    "ðŸ‘¤",
    "ðŸ‘¥",
    "ðŸ‘¦",
    "ðŸ‘§",
    "ðŸ‘¨",
    "ðŸ‘©",
    "ðŸ‘ª",
    "ðŸ‘«",
    "ðŸ‘¬",
    "ðŸ‘­",
    "ðŸ‘®",
    "ðŸ‘¯",
    "ðŸ‘°",
    "ðŸ‘±",
    "ðŸ‘²",
    "ðŸ‘³",
    "ðŸ‘´",
    "ðŸ‘µ",
    "ðŸ‘¶",
    "ðŸ‘·",
    "ðŸ‘¸",
    "ðŸ‘¹",
    "ðŸ‘º",
    "ðŸ‘»",
    "ðŸ‘¼",
    "ðŸ‘½",
    "ðŸ‘¾",
    "ðŸ‘¿",
    "ðŸ’€",
    "ðŸ’",
    "ðŸ’‚",
    "ðŸ’ƒ",
    "ðŸ’„",
    "ðŸ’…",
    "ðŸ’†",
    "ðŸ’‡",
    "ðŸ’ˆ",
    "ðŸ’‰",
    "ðŸ’Š",
    "ðŸ’‹",
    "ðŸ’Œ",
    "ðŸ’",
    "ðŸ’Ž",
    "ðŸ’",
    "ðŸ’",
    "ðŸ’‘",
    "ðŸ’’",
    "ðŸ’“",
    "ðŸ’”",
    "ðŸ’•",
    "ðŸ’–",
    "ðŸ’—",
    "ðŸ’˜",
    "ðŸ’™",
    "ðŸ’š",
    "ðŸ’›",
    "ðŸ’œ",
    "ðŸ’",
    "ðŸ’ž",
    "ðŸ’Ÿ",
    "ðŸ’ ",
    "ðŸ’¡",
    "ðŸ’¢",
    "ðŸ’£",
    "ðŸ’¤",
    "ðŸ’¥",
    "ðŸ’¦",
    "ðŸ’§",
    "ðŸ’¨",
    "ðŸ’©",
    "ðŸ’ª",
    "ðŸ’«",
    "ðŸ’¬",
    "ðŸ’®",
    "ðŸ’¯",
    "ðŸ’°",
    "ðŸ’±",
    "ðŸ’²",
    "ðŸ’³",
    "ðŸ’´",
    "ðŸ’µ",
    "ðŸ’¶",
    "ðŸ’·",
    "ðŸ’¸",
    "ðŸ’¹",
    "ðŸ’º",
    "ðŸ’»",
    "ðŸ’¼",
    "ðŸ’½",
    "ðŸ’¾",
    "ðŸ’¿",
    "ðŸ“€",
    "ðŸ“",
    "ðŸ“ƒ",
    "ðŸ“…",
    "ðŸ“‡",
    "ðŸ“ˆ",
    "ðŸ“‰",
    "ðŸ“Š",
    "ðŸ“‹",
    "ðŸ“Œ",
    "ðŸ“",
    "ðŸ“Ž",
    "ðŸ“",
    "ðŸ“",
    "ðŸ“‘",
    "ðŸ“’",
    "ðŸ““",
    "ðŸ“”",
    "ðŸ“•",
    "ðŸ“–",
    "ðŸ“—",
    "ðŸ“˜",
    "ðŸ“™",
    "ðŸ“š",
    "ðŸ“›",
    "ðŸ“œ",
    "ðŸ“",
    "ðŸ“ž",
    "ðŸ“Ÿ",
    "ðŸ“ ",
    "ðŸ“¡",
    "ðŸ“¢",
    "ðŸ“£",
    "ðŸ“¤",
    "ðŸ“¦",
    "ðŸ“§",
    "ðŸ“¨",
    "ðŸ“©",
    "ðŸ“ª",
    "ðŸ“¬",
    "ðŸ“­",
    "ðŸ“®",
    "ðŸ“¯",
    "ðŸ“°",
    "ðŸ“±",
    "ðŸ“³",
    "ðŸ“µ",
    "ðŸ“¶",
    "ðŸ“·",
    "ðŸ“¹",
    "ðŸ“º",
    "ðŸ“»",
    "ðŸ“¼",
    "ðŸ“½ï¸",
    "ðŸ“¿",
    "ðŸ”€",
    "ðŸ”",
    "ðŸ”ƒ",
    "ðŸ”„",
    "ðŸ”…",
    "ðŸ”†",
    "ðŸ”‡",
    "ðŸ”Š",
    "ðŸ”‹",
    "ðŸ”Œ",
    "ðŸ”Ž",
    "ðŸ”",
    "ðŸ”‘",
    "ðŸ”“",
    "ðŸ””",
    "ðŸ”•",
    "ðŸ”–",
    "ðŸ”—",
    "ðŸ”˜",
    "ðŸ”›",
    "ðŸ”",
    "ðŸ”ž",
    "ðŸ”Ÿ",
    "ðŸ” ",
    "ðŸ”¢",
    "ðŸ”£",
    "ðŸ”¤",
    "ðŸ”¥",
    "ðŸ”¦",
    "ðŸ”§",
    "ðŸ”¨",
    "ðŸ”©",
    "ðŸ”ª",
    "ðŸ”«",
    "ðŸ”¬",
    "ðŸ”­",
    "ðŸ”®",
    "ðŸ”¯",
    "ðŸ”°",
    "ðŸ”±",
    "ðŸ”²",
    "ðŸ”³",
    "ðŸ”´",
    "ðŸ”µ",
    "ðŸ”¶",
    "ðŸ”·",
    "ðŸ”¸",
    "ðŸ”¹",
    "ðŸ”º",
    "ðŸ”»",
    "ðŸ”¼",
    "ðŸ•‰ï¸",
    "ðŸ•Šï¸",
    "ðŸ•‹",
    "ðŸ•Œ",
    "ðŸ•",
    "ðŸ•Ž",
    "ðŸ•",
    "ðŸ–¤",
    "ðŸ–¥ï¸",
    "ðŸ–¨ï¸",
    "ðŸ–±ï¸",
    "ðŸ–²ï¸",
    "ðŸ–¼ï¸",
    "ðŸ—‚ï¸",
    "ðŸ—ƒï¸",
    "ðŸ—„ï¸",
    "ðŸ—‘ï¸",
    "ðŸ—’ï¸",
    "ðŸ—“ï¸",
    "ðŸ—œï¸",
    "ðŸ—ï¸",
    "ðŸ—žï¸",
    "ðŸ—¡ï¸",
    "ðŸ—£ï¸",
    "ðŸ—¨ï¸",
    "ðŸ—¯ï¸",
    "ðŸ—³ï¸",
    "ðŸ—ºï¸",
    "ðŸ—»",
    "ðŸ—¼",
    "ðŸ—½",
    "ðŸ—¾",
    "ðŸ—¿",
    "ðŸ˜€",
    "ðŸ˜",
    "ðŸ˜‚",
    "ðŸ˜†",
    "ðŸ˜‡",
    "ðŸ˜ˆ",
    "ðŸ˜‰",
    "ðŸ˜‹",
    "ðŸ˜Œ",
    "ðŸ˜",
    "ðŸ˜Ž",
    "ðŸ˜",
    "ðŸ˜",
    "ðŸ˜‘",
    "ðŸ˜’",
    "ðŸ˜“",
    "ðŸ˜–",
    "ðŸ˜˜",
    "ðŸ˜š",
    "ðŸ˜›",
    "ðŸ˜ ",
    "ðŸ˜¡",
    "ðŸ˜¢",
    "ðŸ˜£",
    "ðŸ˜¤",
    "ðŸ˜¥",
    "ðŸ˜¨",
    "ðŸ˜ª",
    "ðŸ˜¬",
    "ðŸ˜­",
    "ðŸ˜®",
    "ðŸ˜°",
    "ðŸ˜±",
    "ðŸ˜³",
    "ðŸ˜´",
    "ðŸ˜µ",
    "ðŸ˜¶",
    "ðŸ˜·",
    "ðŸ˜¸",
    "ðŸ˜¹",
    "ðŸ˜»",
    "ðŸ˜¼",
    "ðŸ˜½",
    "ðŸ˜¾",
    "ðŸ˜¿",
    "ðŸ™€",
    "ðŸ™‚",
    "ðŸ™ƒ",
    "ðŸ™„",
    "ðŸ™…",
    "ðŸ™†",
    "ðŸ™‡",
    "ðŸ™ˆ",
    "ðŸ™‰",
    "ðŸ™‹",
    "ðŸ™Œ",
    "ðŸ™",
    "ðŸ™Ž",
    "ðŸ™",
    "ðŸš€",
    "ðŸš",
    "ðŸš‚",
    "ðŸšƒ",
    "ðŸš„",
    "ðŸš…",
    "ðŸš†",
    "ðŸš‡",
    "ðŸš‰",
    "ðŸšŠ",
    "ðŸš‹",
    "ðŸšŒ",
    "ðŸš",
    "ðŸšŽ",
    "ðŸš",
    "ðŸš",
    "ðŸš‘",
    "ðŸš’",
    "ðŸš“",
    "ðŸš”",
    "ðŸš•",
    "ðŸš–",
    "ðŸš—",
    "ðŸš˜",
    "ðŸš™",
    "ðŸšš",
    "ðŸš›",
    "ðŸšœ",
    "ðŸš",
    "ðŸšž",
    "ðŸšŸ",
    "ðŸš ",
    "ðŸš¡",
    "ðŸš¢",
    "ðŸš£",
    "ðŸš¤",
    "ðŸš¥",
    "ðŸš¦",
    "ðŸš§",
    "ðŸš¨",
    "ðŸš©",
    "ðŸšª",
    "ðŸš«",
    "ðŸš¬",
    "ðŸš­",
    "ðŸš®",
    "ðŸš¯",
    "ðŸš°",
    "ðŸš±",
    "ðŸš²",
    "ðŸš³",
    "ðŸš´",
    "ðŸšµ",
    "ðŸš¶",
    "ðŸš·",
    "ðŸš¸",
    "ðŸš¹",
    "ðŸšº",
    "ðŸš»",
    "ðŸš¼",
    "ðŸš½",
    "ðŸš¾",
    "ðŸš¿",
    "ðŸ›€",
    "ðŸ›",
    "ðŸ›‚",
    "ðŸ›ƒ",
    "ðŸ›„",
    "ðŸ›…",
    "ðŸ›‹ï¸",
    "ðŸ›Œ",
    "ðŸ›ï¸",
    "ðŸ›Žï¸",
    "ðŸ›ï¸",
    "ðŸ›",
    "ðŸ›‘",
    "ðŸ›’",
    "ðŸ›•",
    "ðŸ› ï¸",
    "ðŸ›¡ï¸",
    "ðŸ›¢ï¸",
    "ðŸ›£ï¸",
    "ðŸ›¤ï¸",
    "ðŸ›¥ï¸",
    "ðŸ›©ï¸",
    "ðŸ›«",
    "ðŸ›¬",
    "ðŸ›°ï¸",
    "ðŸ›³ï¸",
    "ðŸ›´",
    "ðŸ›µ",
    "ðŸ›¶",
    "ðŸ›·",
    "ðŸ›¸",
    "ðŸ›¹",
    "ðŸ›º",
    "ðŸŸ ",
    "ðŸŸ¡",
    "ðŸŸ¢",
    "ðŸŸ£",
    "ðŸŸ¤",
    "ðŸŸ¥",
    "ðŸŸ¦",
    "ðŸŸ§",
    "ðŸŸ¨",
    "ðŸŸ©",
    "ðŸŸª",
    "ðŸŸ«",
    "ðŸ¤",
    "ðŸ¤Ž",
    "ðŸ¤",
    "ðŸ¤",
    "ðŸ¤‘",
    "ðŸ¤’",
    "ðŸ¤“",
    "ðŸ¤”",
    "ðŸ¤•",
    "ðŸ¤–",
    "ðŸ¤—",
    "ðŸ¤˜",
    "ðŸ¤™",
    "ðŸ¤š",
    "ðŸ¤œ",
    "ðŸ¤",
    "ðŸ¤ž",
    "ðŸ¤Ÿ",
    "ðŸ¤ ",
    "ðŸ¤¡",
    "ðŸ¤¢",
    "ðŸ¤£",
    "ðŸ¤¤",
    "ðŸ¤¥",
    "ðŸ¤¦",
    "ðŸ¤§",
    "ðŸ¤¨",
    "ðŸ¤©",
    "ðŸ¤ª",
    "ðŸ¤«",
    "ðŸ¤¬",
    "ðŸ¤­",
    "ðŸ¤¯",
    "ðŸ¤°",
    "ðŸ¤±",
    "ðŸ¤²",
    "ðŸ¤³",
    "ðŸ¤´",
    "ðŸ¤µ",
    "ðŸ¤¶",
    "ðŸ¤·",
    "ðŸ¤¸",
    "ðŸ¤¹",
    "ðŸ¤º",
    "ðŸ¤¼",
    "ðŸ¤½",
    "ðŸ¤¾",
    "ðŸ¤¿",
    "ðŸ¥€",
    "ðŸ¥",
    "ðŸ¥‚",
    "ðŸ¥ƒ",
    "ðŸ¥„",
    "ðŸ¥…",
    "ðŸ¥‡",
    "ðŸ¥ˆ",
    "ðŸ¥‰",
    "ðŸ¥Š",
    "ðŸ¥‹",
    "ðŸ¥Œ",
    "ðŸ¥",
    "ðŸ¥Ž",
    "ðŸ¥",
    "ðŸ¥",
    "ðŸ¥‘",
    "ðŸ¥’",
    "ðŸ¥“",
    "ðŸ¥”",
    "ðŸ¥•",
    "ðŸ¥–",
    "ðŸ¥—",
    "ðŸ¥˜",
    "ðŸ¥™",
    "ðŸ¥š",
    "ðŸ¥›",
    "ðŸ¥œ",
    "ðŸ¥",
    "ðŸ¥ž",
    "ðŸ¥Ÿ",
    "ðŸ¥ ",
    "ðŸ¥¡",
    "ðŸ¥¢",
    "ðŸ¥£",
    "ðŸ¥¤",
    "ðŸ¥¥",
    "ðŸ¥¦",
    "ðŸ¥§",
    "ðŸ¥¨",
    "ðŸ¥©",
    "ðŸ¥ª",
    "ðŸ¥«",
    "ðŸ¥¬",
    "ðŸ¥­",
    "ðŸ¥®",
    "ðŸ¥¯",
    "ðŸ¥°",
    "ðŸ¥±",
    "ðŸ¥³",
    "ðŸ¥´",
    "ðŸ¥µ",
    "ðŸ¥¶",
    "ðŸ¥º",
    "ðŸ¥»",
    "ðŸ¥¼",
    "ðŸ¥½",
    "ðŸ¥¾",
    "ðŸ¥¿",
    "ðŸ¦€",
    "ðŸ¦",
    "ðŸ¦‚",
    "ðŸ¦ƒ",
    "ðŸ¦„",
    "ðŸ¦…",
    "ðŸ¦†",
    "ðŸ¦‡",
    "ðŸ¦ˆ",
    "ðŸ¦‰",
    "ðŸ¦Š",
    "ðŸ¦‹",
    "ðŸ¦Œ",
    "ðŸ¦",
    "ðŸ¦Ž",
    "ðŸ¦",
    "ðŸ¦",
    "ðŸ¦‘",
    "ðŸ¦’",
    "ðŸ¦“",
    "ðŸ¦”",
    "ðŸ¦•",
    "ðŸ¦–",
    "ðŸ¦—",
    "ðŸ¦˜",
    "ðŸ¦™",
    "ðŸ¦š",
    "ðŸ¦›",
    "ðŸ¦œ",
    "ðŸ¦",
    "ðŸ¦ž",
    "ðŸ¦Ÿ",
    "ðŸ¦ ",
    "ðŸ¦¡",
    "ðŸ¦¢",
    "ðŸ¦¥",
    "ðŸ¦¦",
    "ðŸ¦§",
    "ðŸ¦¨",
    "ðŸ¦©",
    "ðŸ¦ª",
    "ðŸ¦®",
    "ðŸ¦¯",
    "ðŸ¦´",
    "ðŸ¦µ",
    "ðŸ¦¶",
    "ðŸ¦·",
    "ðŸ¦¸",
    "ðŸ¦¹",
    "ðŸ¦º",
    "ðŸ¦»",
    "ðŸ¦¼",
    "ðŸ¦½",
    "ðŸ¦¾",
    "ðŸ¦¿",
    "ðŸ§€",
    "ðŸ§",
    "ðŸ§‚",
    "ðŸ§ƒ",
    "ðŸ§„",
    "ðŸ§…",
    "ðŸ§†",
    "ðŸ§‡",
    "ðŸ§ˆ",
    "ðŸ§‰",
    "ðŸ§Š",
    "ðŸ§",
    "ðŸ§Ž",
    "ðŸ§",
    "ðŸ§",
    "ðŸ§–",
    "ðŸ§—",
    "ðŸ§˜",
    "ðŸ§™",
    "ðŸ§š",
    "ðŸ§›",
    "ðŸ§œ",
    "ðŸ§",
    "ðŸ§ž",
    "ðŸ§Ÿ",
    "ðŸ§ ",
    "ðŸ§¡",
    "ðŸ§¢",
    "ðŸ§£",
    "ðŸ§¤",
    "ðŸ§¥",
    "ðŸ§¦",
    "ðŸ§§",
    "ðŸ§¨",
    "ðŸ§©",
    "ðŸ§ª",
    "ðŸ§«",
    "ðŸ§¬",
    "ðŸ§­",
    "ðŸ§®",
    "ðŸ§¯",
    "ðŸ§°",
    "ðŸ§±",
    "ðŸ§²",
    "ðŸ§³",
    "ðŸ§´",
    "ðŸ§µ",
    "ðŸ§¶",
    "ðŸ§·",
    "ðŸ§¸",
    "ðŸ§¹",
    "ðŸ§º",
    "ðŸ§»",
    "ðŸ§¼",
    "ðŸ§½",
    "ðŸ§¾",
    "ðŸ§¿",
    "ðŸ©°",
    "ðŸ©±",
    "ðŸ©²",
    "ðŸ©³",
    "ðŸ©¸",
    "ðŸ©¹",
    "ðŸ©º",
    "ðŸª€",
    "ðŸª",
    "ðŸª‚",
    "ðŸª",
    "ðŸª‘",
    "ðŸª’",
    "ðŸª“",
    "ðŸª”",
    "ðŸª•",
    "â„¹ï¸",
    "âŒ›ï¸",
    "âŒ¨ï¸",
    "âï¸",
    "âª",
    "â¬",
    "â°",
    "â±ï¸",
    "â²ï¸",
    "â˜€ï¸",
    "â˜ï¸",
    "â˜‚ï¸",
    "â˜ƒï¸",
    "â˜„ï¸",
    "â˜Žï¸",
    "â˜‘ï¸",
    "â˜˜ï¸",
    "â˜ï¸",
    "â˜ ï¸",
    "â˜¢ï¸",
    "â˜£ï¸",
    "â˜¦ï¸",
    "â˜ªï¸",
    "â˜®ï¸",
    "â˜¯ï¸",
    "â˜¸ï¸",
    "â˜¹ï¸",
    "â˜ºï¸",
    "â™€ï¸",
    "â™‚ï¸",
    "â™Ÿï¸",
    "â™£ï¸",
    "â™¥ï¸",
    "â™¦ï¸",
    "â™¨ï¸",
    "â™»ï¸",
    "âš’ï¸",
    "âš”ï¸",
    "âš•ï¸",
    "âš–ï¸",
    "âš—ï¸",
    "âš™ï¸",
    "âš›ï¸",
    "âšœï¸",
    "âš ï¸",
    "âš°ï¸",
    "âš±ï¸",
    "â›ˆï¸",
    "â›Ž",
    "â›ï¸",
    "â›‘ï¸",
    "â›“ï¸",
    "â›©ï¸",
    "â›°ï¸",
    "â›±ï¸",
    "â›´ï¸",
    "â›·ï¸",
    "â›¸ï¸",
    "â›¹ï¸",
    "âœ‚ï¸",
    "âœ…",
    "âœˆï¸",
    "âœ‰ï¸",
    "âœŠ",
    "âœ‹",
    "âœŒï¸",
    "âœï¸",
    "âœï¸",
    "âœ’ï¸",
    "âœ”ï¸",
    "âœ–ï¸",
    "âœï¸",
    "âœ¡ï¸",
    "âœ¨",
    "âœ³ï¸",
    "âœ´ï¸",
    "â„ï¸",
    "â‡ï¸",
    "âŒ",
    "âŽ",
    "â“",
    "â”",
    "â•",
    "â£ï¸",
    "â¤ï¸",
    "âž•",
    "âž–",
    "âž—",
]

const validRules = [
    "0001",
    "1011",
    "0221",
    "1231",
    "0021",
    "1031",
    "0112",
    "1012",
    "1232",
    "0332",
    "0132",
    "1032",
    "0223",
    "2023",
    "3033",
    "1233",
    "0023",
    "1033",
    "0114",
    "2024",
    "1234",
    "0134",
    "1034",
    "0024"
];

// This seems such a stupid idea but it opens the possibility of variants
const forms = [
    [
        'All <span class="subject">$</span> is <span class="subject">$</span>',
        'No <span class="subject">$</span> is <span class="subject">$</span>',
        'Some <span class="subject">$</span> is <span class="subject">$</span>',
        'Some <span class="subject">$</span> is not <span class="subject">$</span>'
    ],
    [
        '<span class="is-negated">No</span> <span class="subject">$</span> is <span class="subject">$</span>',
        '<span class="is-negated">All</span> <span class="subject">$</span> is <span class="subject">$</span>',
        'Some <span class="subject">$</span> <span class="is-negated">is not</span> <span class="subject">$</span>',
        'Some <span class="subject">$</span> <span class="is-negated">is</span> <span class="subject">$</span>'
    ],
];

const dirNames = [
    null,
    "North",
    "North-East",
    "East",
    "South-East",
    "South",
    "South-West",
    "West",
    "North-West"
];

const nameInverseDir = {
    "North": "South",
    "North-East": "South-West",
    "East": "West",
    "South-East": "North-West",
    "South": "North",
    "South-West": "North-East",
    "West": "East",
    "North-West": "South-East"
};

const dirCoords = [
    [ 0,  0],
    [ 0,  1],
    [ 1,  1],
    [ 1,  0],
    [ 1, -1],
    [ 0, -1],
    [-1, -1],
    [-1,  0],
    [-1,  1]
];

const dirString = (x, y, z) => {
    let str = '';
    if (z === 1) str = 'Above';
    if (z === -1) str = 'Below';
    if (z && (x || y)) str += ' and ';
    if (y === 1) str += 'North';
    if (y === -1) str += 'South';
    if (y && x) str += '-';
    if (x === 1) str += 'East';
    if (x === -1) str += 'West';
    return str;
}

const dirStringFromCoord = (coord) => {
    return dirString.apply(null, coord);
}

function twoDToArrow(coord) {
    const arrowMap = {
        "1,0": `<i class="ci-Arrow_Left_MD"></i>`,
        "1,1": `<i class="ci-Arrow_Down_Left_MD"></i>`,
        "1,-1": `<i class="ci-Arrow_Up_Left_MD"></i>`,
        "0,1": `<i class="ci-Arrow_Down_LG"></i>`,
        "0,-1": `<i class="ci-Arrow_Up_LG"></i>`,
        "-1,0": `<i class="ci-Arrow_Right_LG"></i>`,
        "-1,1": `<i class="ci-Arrow_Down_Right_LG"></i>`,
        "-1,-1": `<i class="ci-Arrow_Up_Right_LG"></i>`,
    };

    return arrowMap[coord.slice(0, 2).join(",")] || '<i class="ci-Wifi_None"></i>';
}

function threeDToTriangle(coord) {
    if (coord.length < 3) {
        return '';
    }

    if (coord[2] === 1) {
        return 'â–¼';
    } else if (coord[2] === -1) {
        return 'â–²';
    } else {
        return '<i class="ci-Wifi_None"></i>';
    }
}

function fourDToArrow(coord) {
    if (coord.length < 4) {
        return '';
    }

    if (coord[3] === 1) {
        return 'â—€';
    } else if (coord[3] === -1) {
        return 'â–¶';
    } else {
        return '<i class="ci-Wifi_None"></i>';
    }
}

const dirStringMinimal = (coord) => {
    let str = '';
    str += fourDToArrow(coord);
    str += threeDToTriangle(coord);
    str += twoDToArrow(coord);
    return str;
}

const dirCoords3D = [];
const dirNames3D = [];
const nameInverseDir3D = {};

const xs = Array(3).fill(0).map((_, i) => i-1)
xs.map(x =>
    xs.map(y =>
        xs.map(z => {
            if (x === 0 && y === 0 && z === 0) return;
            dirCoords3D.push([ x, y, z ]);
            dirNames3D.push(dirString(x, y, z));
            nameInverseDir3D[dirString(x, y, z)] = dirString(-x, -y, -z);
        })
    )
);

const dirCoords4D = [];
xs.map(x =>
    xs.map(y =>
        xs.map(z => {
            xs.map(time => {
                if (x === 0 && y === 0 && z === 0 && time === 0) return;
                dirCoords4D.push([ x, y, z, time ]);
            })
        })
    )
);

const timeNames = ['was', 'is', 'will be'];
const timeMapping = {
    [-1]: 'was',
    [0]: 'is',
    [1]: 'will be'
}
const reverseTimeNames = {
    'was': 'will be',
    'is': 'is',
    'will be': 'was'
}

const dimensionNames = {
    [0]: 'X',
    [1]: 'Y',
    [2]: 'Z',
    [3]: 'T'
}



/* ---- js/generators/utils.js ---- */


function pickRandomItems(array, n) {
    const copy = [...array];
    const picked = [];
    while (n > 0) {
        const rnd = Math.floor(Math.random()*copy.length);
        picked.push(copy.splice(rnd, 1)[0]);
        n--;
    }
    return { picked, remaining: copy };
}

function shuffle(array) {
    let currentIndex = array.length, randomIndex;
    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
}

function coinFlip() {
    return Math.random() > 0.5;
}

function randomInclusive(start, end) {
    if (start >= end) {
        return start;
    }
    return Math.floor(Math.random() * (end - start + 1)) + start;
}

function arraysEqual(arr1, arr2) {
    return arr1.length === arr2.length && arr1.every((value, index) => value === arr2[index]);
}

function removeDuplicateArrays(arrays) {
    const uniqueArrays = arrays.filter((arr, index, self) =>
      index === self.findIndex(otherArr => arraysEqual(arr, otherArr))
    );

    return uniqueArrays;
}

function removeDuplicates(arr) {
  const seen = new Set();
  return arr.filter(item => {
    if (seen.has(item))
        return false;
    seen.add(item);
    return true;
  });
}

function getPremisesFor(key, defaultQuota) {
    if (savedata[key] && typeof savedata[key] === 'number' && isFinite(savedata[key])) {
        return defaultQuota >= 2 ? Math.max(2, savedata[key]) : savedata[key];
    } else {
        return defaultQuota;
    }
}

function pickNegatable(cs) {
    return savedata.enableNegation ? pickRandomItems(cs, 1).picked[0] : cs[0];
}

function interleaveArrays(arr1, arr2) {
    const maxLength = Math.max(arr1.length, arr2.length); // Get the longer array's length
    const result = [];

    for (let i = 0; i < maxLength; i++) {
        if (i < arr1.length) {
            result.push(arr1[i]); // Add element from the first array if it exists
        }
        if (i < arr2.length) {
            result.push(arr2[i]); // Add element from the second array if it exists
        }
    }

    return result;
}

function frontHeavyIntervalMerge(left, right) {
    const result = [];
    const totalIntervals = right.length + 1;
    const lowInterval = Math.floor(left.length / totalIntervals);
    const highInterval = Math.ceil(left.length / totalIntervals);
    const numHigh = left.length % totalIntervals;

    let m = 0;
    let n = 0;

    for (let i = 0; i < numHigh; i++) {
        for (let j = 0; j < highInterval; j++) {
            result.push(left[m++]);
        }
        if (n < right.length) {
            result.push(right[n++]);
        }
    }

    for (let i = numHigh; i < totalIntervals; i++) {
        for (let j = 0; j < lowInterval; j++) {
            result.push(left[m++]);
        }
        if (n < right.length) {
            result.push(right[n++]);
        }
    }

    return result;
}

function pairwise(arr, callback) {
    for (let i = 0; i < arr.length - 1; i++) {
        callback(arr[i], arr[i + 1], i, arr);
    }
}

function repeatArrayUntil(arr, n) {
    const result = [];
    while (result.length < n) {
        result.push(...arr); // Spread the array and append it to the result
    }
    return result.slice(0, n); // Trim the array to exactly 'n' elements
}

function getLocalStorageObj(key) {
    const entry = localStorage.getItem(key);
    if (entry) {
        return JSON.parse(entry);
    } else {
        return null;
    }
}

function setLocalStorageObj(key, obj) {
    localStorage.setItem(key, JSON.stringify(obj));
}

function normalizeString(input) {
    return input
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '');
}

function oneOutOf(n) {
    return Math.random() < 1 / n;
}



/* ---- js/generators/anchors.js ---- */


function generateStarSVG(color) {
    return `<svg class="anchor" width="50" height="50" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <path 
                  d="M50,5 L61,37 L95,37 L68,59 L79,91 L50,72 L21,91 L32,59 L5,37 L39,37 Z" 
                  fill="${color}" 
                  stroke="#000000" 
                  stroke-width="3"
                  stroke-linejoin="round" 
                  stroke-linecap="round" 
              />
            </svg>`;
}

function generateCircleSVG(color) {
    return `<svg class="anchor" width="50" height="50" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="45" fill="${color}" stroke="#000000" />
            </svg>`;
}

function generateTriangleSVG(color) {
    return `<svg class="anchor" width="50" height="50" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <polygon points="50,10 90,90 10,90" fill="${color}" stroke="#000000" />
            </svg>`;
}

function generateHeartSVG(color) {
    return `<svg class="anchor" width="50" height="50" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <path d="M50,90 L20,60 C10,50 10,30 20,20 C30,10 50,10 50,30 C50,10 70,10 80,20 C90,30 90,50 80,60 Z" fill="${color}" stroke="#000000" />
            </svg>`;
}

function generateFastForwardSVG() {
    return `<svg class="anchor arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M13,6V18L21.5,12M4,18L12.5,12L4,6V18Z" /></svg>`;
}

function generateRewindSVG() {
    return `<svg class="anchor arrow" xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24"><path d="M11.5,12L20,18V6M11,18V6L2.5,12L11,18Z" /></svg>`;
}

function generateUpArrow() {
  return `<svg class="anchor arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M15,20H9V12H4.16L12,4.16L19.84,12H15V20Z" /></svg>`
}

function generateDownArrow() {
  return `<svg class="anchor arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M9,4H15V12H19.84L12,19.84L4.16,12H9V4Z" /></svg>`
}

function generateLeftArrow() {
  return `<svg class="anchor arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M20,9V15H12V19.84L4.16,12L12,4.16V9H20Z" /></svg>`
}

function generateRightArrow() {
  return `<svg class="anchor arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M4,15V9H12V4.16L19.84,12L12,19.84V15H4Z" /></svg>`
}

const REUSABLE_SVGS = {
  0: generateStarSVG('#8585e0'),
  1: generateCircleSVG('#17ebeb'),
  2: generateTriangleSVG('#f8f843'),
  3: generateHeartSVG('#e32020'),
  4: generateFastForwardSVG(),
  5: generateRewindSVG(),
  6: generateUpArrow(),
  7: generateDownArrow(),
  8: generateLeftArrow(),
  9: generateRightArrow(),
}

document.getElementById('svg-0').innerHTML = REUSABLE_SVGS[0];
document.getElementById('svg-1').innerHTML = REUSABLE_SVGS[1];
document.getElementById('svg-2').innerHTML = REUSABLE_SVGS[2];
document.getElementById('svg-3').innerHTML = REUSABLE_SVGS[3];



/* ---- js/generators/color-comparator.js ---- */


class ColorComparator {
    static hslToRgb(h, s, l) {
        s /= 100;
        l /= 100;
        const k = n => (n + h / 30) % 12;
        const a = s * Math.min(l, 1 - l);
        const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
        return [Math.round(f(0) * 255), Math.round(f(8) * 255), Math.round(f(4) * 255)];
    }

    static rgbToXyz(r, g, b) {
        [r, g, b] = [r, g, b].map(v => {
            v /= 255;
            return v > 0.04045 ? ((v + 0.055) / 1.055) ** 2.4 : v / 12.92;
        });

        return [
            (r * 0.4124564 + g * 0.3575761 + b * 0.1804375) * 100,
            (r * 0.2126729 + g * 0.7151522 + b * 0.0721750) * 100,
            (r * 0.0193339 + g * 0.1191920 + b * 0.9503041) * 100
        ];
    }

    static xyzToLab(x, y, z) {
        const refX = 95.047, refY = 100.000, refZ = 108.883;
        x /= refX; y /= refY; z /= refZ;

        [x, y, z] = [x, y, z].map(v =>
            v > 0.008856 ? Math.cbrt(v) : (7.787 * v) + (16 / 116)
        );

        return [
            (116 * y) - 16,
            500 * (x - y),
            200 * (y - z)
        ];
    }

    static deltaE2000(lab1, lab2) {
        const [L1, a1, b1] = lab1, [L2, a2, b2] = lab2;
        const avgL = (L1 + L2) / 2;
        const C1 = Math.sqrt(a1 ** 2 + b1 ** 2);
        const C2 = Math.sqrt(a2 ** 2 + b2 ** 2);
        const avgC = (C1 + C2) / 2;

        const G = 0.5 * (1 - Math.sqrt(avgC ** 7 / (avgC ** 7 + 25 ** 7)));
        const a1p = (1 + G) * a1;
        const a2p = (1 + G) * a2;
        const C1p = Math.sqrt(a1p ** 2 + b1 ** 2);
        const C2p = Math.sqrt(a2p ** 2 + b2 ** 2);
        const avgCp = (C1p + C2p) / 2;

        const h1p = Math.atan2(b1, a1p) * (180 / Math.PI);
        const h2p = Math.atan2(b2, a2p) * (180 / Math.PI);
        const avgHp = Math.abs(h1p - h2p) > 180 ? (h1p + h2p + 360) / 2 : (h1p + h2p) / 2;

        const T = 1 -
            0.17 * Math.cos((avgHp - 30) * (Math.PI / 180)) +
            0.24 * Math.cos((2 * avgHp) * (Math.PI / 180)) +
            0.32 * Math.cos((3 * avgHp + 6) * (Math.PI / 180)) -
            0.20 * Math.cos((4 * avgHp - 63) * (Math.PI / 180));

        const deltaLp = L2 - L1;
        const deltaCp = C2p - C1p;
        const deltaHp = 2 * Math.sqrt(C1p * C2p) * Math.sin(((h2p - h1p) / 2) * (Math.PI / 180));

        const SL = 1 + ((0.015 * (avgL - 50) ** 2) / Math.sqrt(20 + (avgL - 50) ** 2));
        const SC = 1 + 0.045 * avgCp;
        const SH = 1 + 0.015 * avgCp * T;

        const deltaTheta = 30 * Math.exp(-(((avgHp - 275) / 25) ** 2));
        const RC = 2 * Math.sqrt(avgCp ** 7 / (avgCp ** 7 + 25 ** 7));
        const RT = -RC * Math.sin(2 * deltaTheta * (Math.PI / 180));

        return Math.sqrt(
            (deltaLp / SL) ** 2 +
            (deltaCp / SC) ** 2 +
            (deltaHp / SH) ** 2 +
            RT * (deltaCp / SC) * (deltaHp / SH)
        );
    }

    static compareHslColors(hsl1, hsl2) {
        const parseHsl = hsl => hsl.match(/\d+/g).map(Number);

        const rgb1 = this.hslToRgb(...parseHsl(hsl1));
        const rgb2 = this.hslToRgb(...parseHsl(hsl2));

        const lab1 = this.xyzToLab(...this.rgbToXyz(...rgb1));
        const lab2 = this.xyzToLab(...this.rgbToXyz(...rgb2));

        return this.deltaE2000(lab1, lab2);
    }

    static areSimilarHslColors(hsl1, hsl2) {
      const index = this.compareHslColors(hsl1, hsl2);
      return index < 18;
    }
}



/* ---- js/generators/junk-emojis.js ---- */


const EMOJI_LENGTH = 50;
const JUNK_EMOJI_COUNT = 1000;
class JunkEmojis {
    constructor() {
        this.id = 0;
        this.prevColor = null;
        this.pool = JunkEmojis.generateColorPool();
    }

    static shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const randomIndex = Math.floor(Math.random() * (i + 1));
            [array[i], array[randomIndex]] = [array[randomIndex], array[i]];
        }
        return array;
    }

    static perfectShuffle(arr, groupCount) {
        let groups = Array.from({ length: groupCount }, () => []);

        for (let i = 0; i < arr.length; i++) {
            groups[i % groupCount].push(arr[i]);
        }

        return [].concat(...groups);
    }

    static zipShuffle(arrays) {
        const maxLength = Math.max(...arrays.map(arr => arr.length));
    
        const result = [];
        for (let i = 0; i < maxLength; i++) {
            const group = arrays.map(arr => arr?.[i]).filter(x => x !== undefined);
            const splits = pickRandomItems([3,4,5,6,7,8,9], 1).picked[0];
            result.push(JunkEmojis.perfectShuffle(group, splits));
        }
    
        return result.flat();
    }

    static generateColorPool() {
        const colors = [];

        const hueGroups = [];
        const hues = [0,10,20,30,40,45,50,55,60,65,70,80,90,100,115,130,145,160,170,180,190,200,210,220,230,237,244,250,260,270,280,290,295,300,305,310,320,330,340,350];
        const saturationsA = [10, 100, 25, 75, 95, 38, 85, 43, 68, 47, 55, 50];
        const saturationsB = saturationsA.slice().reverse();
        const lightA = [12, 92, 22, 82, 32, 77, 42, 67, 54, 59];
        const lightB = lightA.slice().reverse();
        let lightnesses = lightA;
        let saturations = saturationsA;

        for (const hue of hues) {
            const group = [];
            lightnesses = (lightnesses == lightA) ? lightB : lightA;
            saturations = (saturations == saturationsA) ? saturationsB : saturationsA;
            for (const sat of saturations) {
                const saturation = Math.round(sat + (Math.random() - 0.5) * 6);
                for (const light of lightnesses) {
                    const lightness = Math.round(light + (Math.random() - 0.5) * 6);
                    if (85 < hue && hue < 150 && (lightness <= 30 || saturation <= 30)) {
                        // Puke green is not kawaii
                        continue;
                    }
                    if (Math.random() < 0.01) {
                        group.push(`hsl(${hue}, ${saturation}%, ${0}%)`);
                    } else if (Math.random() < 0.005) {
                        group.push(`hsl(${hue}, ${saturation}%, ${100}%)`);
                    } else {
                        group.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
                    }
                }
            }
            hueGroups.push(group);
        }

        return JunkEmojis.zipShuffle(hueGroups);
    }

    static generateRandomPoints(minX, maxX, minY, maxY, numPoints, minDistance) {
        const points = [];
        const width = maxX - minX;
        const height = maxY - minY;

        const isFarEnough = (x, y) => {
            for (const [px, py] of points) {
                const dx = px - x;
                const dy = py - y;
                if (Math.sqrt(dx * dx + dy * dy) < minDistance) {
                    return false;
                }
            }
            return true;
        };

        const usePerpendicularShifts = oneOutOf(7);
        let usedX = coinFlip();
        for (let tries = 0; tries < 1000 && points.length < numPoints; tries++) {
            let x = minX + Math.random() * width;
            let y = minY + Math.random() * height;
            if (usePerpendicularShifts && points.length > 0) {
                if (usedX) {
                    if (Math.random() < 0.8) {
                        y = points[points.length - 1][1];
                        usedX = false;
                    } else {
                        x = points[points.length - 1][0];
                        usedX = true;
                    }
                } else {
                    if (Math.random() < 0.2) {
                        y = points[points.length - 1][1];
                        usedX = false;
                    } else {
                        x = points[points.length - 1][0];
                        usedX = true;
                    }
                }
            }

            if (isFarEnough(x, y)) {
                points.push([x, y]);
            }
        }

        return points;
    }

    rebuildPool() {
        this.pool = JunkEmojis.generateColorPool();
    }

    bumpId() {
        this.id += 1;
        if (this.id % this.pool.length == 0) {
            this.rebuildPool();
        }
    }

    nextColor() {
        let color = this.pool[this.id % this.pool.length];
        while (this.prevColor && ColorComparator.areSimilarHslColors(color, this.prevColor)) {
            this.bumpId();
            this.prevColor = color;
            color = this.pool[this.id % this.pool.length];
        }
        this.bumpId();
        this.prevColor = color;
        return color;
    }

    generateJunkEmoji(colors, id=-1) {
        const width = EMOJI_LENGTH, height = EMOJI_LENGTH;
        const numPoints = colors.length;
        const points = JunkEmojis.generateRandomPoints(3, width-3, 3, height-3, numPoints, 5);
        const voronoi = d3.Delaunay.from(points).voronoi([0, 0, width, height]);
        let svgContent = `<symbol id="junk-${id}" xmlns="http://www.w3.org/2000/svg" viewbox="0 0 ${width} ${height}">`;

        for (let i = 0; i < points.length; i++) {
            const color = colors[i];
            const cell = voronoi.cellPolygon(i);
            if (cell) {
                const pointsString = cell.map(([x, y]) => `${Math.round(x)},${Math.round(y)}`).join(' ');
                svgContent += `<polygon points="${pointsString}" fill="${color}" />`;
            }
        }

        svgContent += '</symbol>';
        return svgContent;
    }

    parseHSL(hsl) {
        let match = hsl.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
        return match ? match.slice(1).map(Number) : [0, 0, 0];
    }

    generateAllEmoji() {
        let colorCombos = [];
        for (let i = 0; i < JUNK_EMOJI_COUNT; i++) {
            const numColors = pickRandomItems([2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 5], 1).picked[0];
            let combo = [];
            for (let j = 0; j < numColors; j++) {
                combo.push(this.nextColor());
            }
            colorCombos.push(combo);
        }

        colorCombos.sort((a, b) => {
            const [u, v, w] = this.parseHSL(a[0]);
            const [x, y, z] = this.parseHSL(b[0]);
            return u - x || v - y || w - z;
        })

        let s = '<svg style="display: none;">\n';
        s += '<defs>\n';
        let id = 0;
        for (const combo of colorCombos) {
            const svg = this.generateJunkEmoji(combo, id);
            s += svg + '\n';
            id++;
        }
        s += '</defs>\n';
        s += '</svg>\n';
        return s;
    }
}

// To generate:
// console.log(new JunkEmojis(JUNK_EMOJI_COUNT + 1).generateAllEmoji());
// document.addEventListener("DOMContentLoaded", throwSvgsOnPage);

function throwSvgsOnPage() {
    let symbols = Array.from(document.querySelectorAll("symbol"));
    let container = document.createElement("div");
    container.id = "svg-container";

    symbols.forEach((symbol, i) => {
        if (i % (JUNK_EMOJI_COUNT / 10) === 0) {
            let divider = document.createElement("div");
            divider.setAttribute("style", "display: inline-block; width: 10px; height: 50px; border: 3px dotted black; background-color: #FFF");
            container.appendChild(divider);
        }
        let useElement = document.createElementNS("http://www.w3.org/2000/svg", "use");
        useElement.setAttributeNS("http://www.w3.org/1999/xlink", "href", `#${symbol.id}`);

        let svgWrapper = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svgWrapper.setAttribute("viewBox", symbol.getAttribute("viewBox"));
        svgWrapper.setAttribute("width", "50");
        svgWrapper.setAttribute("height", "50");
        svgWrapper.appendChild(useElement);
        container.appendChild(svgWrapper);

    });

    document.body.appendChild(container);
}

function renderJunkEmojisText(text) {
    text = text.replaceAll(/\[junk\](\d+)\[\/junk\]/gi, (match, id) => {
        let s = `<svg class="junk" width="${EMOJI_LENGTH}" height="${EMOJI_LENGTH}">`;
        s += `<use xlink:href="#junk-${id}"></use>`;
        s += '</svg>';
        return s;
    });

    text = text.replaceAll(/\[vnoise\](\d+),(\d+)\[\/vnoise\]/gi, (match, seed, splits) => {
        return new VisualNoise().generateVisualNoise(parseInt(seed), parseInt(splits));
    });

    text = text.replaceAll(/\[svg\](\d+)\[\/svg\]/gi, (match, id) => {
        return REUSABLE_SVGS[id];
    });

    return text;
}

function renderJunkEmojis(question) {
    question = structuredClone(question);
    if (question.bucket) {
        question.bucket = question.bucket.map(renderJunkEmojisText);
    }

    if (question.buckets) {
        question.buckets = question.buckets.map(bucket => bucket.map(renderJunkEmojisText));
    }

    if (question.wordCoordMap) {
        const words = Object.keys(question.wordCoordMap);
        for (const word of words) {
            const rendered = renderJunkEmojisText(word);
            if (rendered.length !== word.length) {
                question.wordCoordMap[rendered] = question.wordCoordMap[word];
                delete question.wordCoordMap[word];
            }
        }
    }

    if (question.subresults) {
        question.subresults = question.subresults.map(renderJunkEmojis);
    }

    if (question.premises) {
        question.premises = question.premises.map(renderJunkEmojisText);
    }

    if (question.operations) {
        question.operations = question.operations.map(renderJunkEmojisText);
    }

    if (question.conclusion) {
        question.conclusion = renderJunkEmojisText(question.conclusion);
    }

    return question;
}




/* ---- js/generators/visual-noise.js ---- */


function seededRandom(seed) {
    let m = 2 ** 31 - 1; // Large prime number
    let a = 48271;       // Multiplier
    let c = 0;           // Increment
    let state = seed % m;

    return function () {
        state = (a * state + c) % m;
        return state / m; // Normalize to [0, 1)
    };
}

class VisualNoise {
    nextColor() {
        const hue = Math.floor(this.random() * 360);
        const saturation = Math.floor(20 + this.random() * 81);
        const lightness = Math.floor(10 + (this.random() * 91));

        return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    }

    weightedRandomIndex(array) {
        const totalWeight = array.reduce((acc, _, index) => acc + Math.pow(index + 1, 2), 0);
        const randomWeight = this.random() * totalWeight;

        let cumulativeWeight = 0;
        for (let i = 0; i < array.length; i++) {
            cumulativeWeight += Math.pow(i + 1, 2);
            if (randomWeight < cumulativeWeight) {
                return i;
            }
        }
    }

    generateEmojiSvg(id, splits, minSplit, maxSplit) {
        const width = 100, height = 50;
        let rectangles = [{ x: 0, y: 0, width, height }];

        for (let i = 0; i < splits; i++) {
            const [rect] = rectangles.splice(this.weightedRandomIndex(rectangles), 1);
            const splitProbability = rect.height / (rect.width + rect.height);
            const splitHorizontally = this.random() < splitProbability;
            if (splitHorizontally) {
                const low = rect.height * minSplit;
                const high = rect.height * maxSplit;
                const splitY = rect.y + low + this.random() * (high - low);
                rectangles.push(
                    { x: rect.x, y: rect.y, width: rect.width, height: splitY - rect.y },
                    { x: rect.x, y: splitY, width: rect.width, height: rect.y + rect.height - splitY }
                );
            } else {
                const low = rect.width * minSplit;
                const high = rect.width * maxSplit;
                const splitX = rect.x + low + this.random() * (high - low);
                rectangles.push(
                    { x: rect.x, y: rect.y, width: splitX - rect.x, height: rect.height },
                    { x: splitX, y: rect.y, width: rect.x + rect.width - splitX, height: rect.height }
                );
            }

            rectangles.sort((a, b) => a.width * a.height - b.width * b.height);
        }

        let svgContent = `<svg id="vnoise-${id}" class="noise" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`;
        for (const rect of rectangles) {
            const color = this.nextColor();
            svgContent += `<rect x="${Math.round(rect.x)}" y="${Math.round(rect.y)}" width="${Math.round(rect.width)}" height="${Math.round(rect.height)}" fill="${color}" />`;
        }

        svgContent += '</svg>';
        return svgContent;
    }

    generateVisualNoise(seed, splits) {
        this.random = seededRandom(seed);
        return this.generateEmojiSvg(seed, splits, 0.25, 0.75);
    }
}



/* ---- js/generators/space-hard-mode.js ---- */


class SpaceHardMode {
    constructor(numTransforms) {
        this.numTransforms = numTransforms;
    }
    
    basicHardMode(wordCoordMap, startWord, endWord, originalConclusionCoord) {
        let newWordMap;
        let newDiffCoord;
        let newConclusionCoord;
        let operations;
        let usedDimensions;
        const demandClose = Math.random() > 0.4;
        const demandChange = Math.random() > 0.2;
        let closeTries = 10;
        let changeTries = 10;
        for (let i = 0; i < 10000; i++) {
            newWordMap = structuredClone(wordCoordMap);
            [operations, usedDimensions] = this.applyHardMode(newWordMap, startWord, endWord);
            [newDiffCoord, newConclusionCoord] = getConclusionCoords(newWordMap, startWord, endWord);
            if (newConclusionCoord.slice(0, 3).every(c => c === 0)) {
                continue;
            }
            const distance = newDiffCoord.map(Math.abs).reduce((a, b) => a + b);
            const distanceLimit = Math.max(3, Math.floor(Object.keys(newWordMap).length / 2));
            const isClose = distance < distanceLimit;
            if (demandClose && !isClose && closeTries > 0) {
                closeTries--;
                continue;
            }
            const isChanged = !arraysEqual(originalConclusionCoord, newConclusionCoord);
            if (demandChange && !isChanged && changeTries > 0) {
                changeTries--;
                continue;
            }
            break;
        }
        return [newWordMap, operations, usedDimensions];
    }

    oneTransform(wordCoordMap, movingWord, dimension, backupDimension) {
        const demandChange = Math.random() < 0.92;
        let changeTries = 8;
        let backupTries = 8;
        let useBackup = false;

        let operation;
        let newWordMap;
        let pool = Object.keys(wordCoordMap).filter(w => w !== movingWord);
        let originalCoord = wordCoordMap[movingWord];
        for (let i = 0; i < 100; i++) {
            newWordMap = structuredClone(wordCoordMap);
            let axisWord = pickRandomItems(pool, 1).picked[0];
            [operation,] = this.applyChain(newWordMap, [], [[[axisWord, movingWord], useBackup ? backupDimension : dimension]]);
            let newCoord = newWordMap[movingWord];
            if (demandChange && changeTries > 0 && arraysEqual(originalCoord, newCoord)) {
                changeTries--;
                if (changeTries === 0) {
                    useBackup = true;
                }
                continue;
            }

            if (demandChange && useBackup && backupTries > 0 && arraysEqual(originalCoord, newCoord)) {
                backupTries--;
                continue;
            }
            break;
        }

        return [newWordMap, operation];
    }

    applyHardMode(wordCoordMap, leftStart, rightStart) {
        const [leftChains, rightChains] = this.createChains(wordCoordMap, leftStart, rightStart);
        const dimensionsUsed = [...leftChains.map(([words, dimension]) => dimension), ...rightChains.map(([words, dimension]) => dimension)];
        const leftOperations = this.applyChain(wordCoordMap, dimensionsUsed, leftChains);
        const rightOperations = this.applyChain(wordCoordMap, dimensionsUsed, rightChains);
        return [[...leftOperations, ...rightOperations], dimensionsUsed];
    }

    createChains(wordCoordMap, leftStart, rightStart) {
        let leftChains = [];
        let rightChains = [];
        let leftDimensions = [];
        let rightDimensions = [];

        const bannedFromPool = new Set([leftStart, rightStart]);
        const pool = Object.keys(wordCoordMap).filter(word => !bannedFromPool.has(word));
        const dimensionPool = wordCoordMap[leftStart].map((c, i) => i);

        let wordSequence = repeatArrayUntil(shuffle(pool.slice()), this.numTransforms);
        let count = 0;
        while (wordSequence.length > 0 && count < 100) {
            let chainSize = Math.min(wordSequence.length, pickRandomItems([1, 1, 2, 2, 3], 1).picked[0]);
            let willUseAllTransforms = chainSize == wordSequence.length && leftChains.length == 0 && rightChains.length == 0;
            let shouldNotChain = pool.length == 1 || (willUseAllTransforms && Math.random() < 0.4)
            if (shouldNotChain)
                chainSize = 1;
            let words = wordSequence.splice(0, chainSize);
            if (coinFlip()) {
                leftChains.push(this.directionize(words, leftStart, leftDimensions, rightDimensions, dimensionPool, wordCoordMap));
                leftDimensions.push(leftChains[leftChains.length - 1][1]);
            } else {
                rightChains.push(this.directionize(words, rightStart, rightDimensions, leftDimensions, dimensionPool, wordCoordMap));
                rightDimensions.push(rightChains[rightChains.length - 1][1]);
            }
            count++;
        }

        return [leftChains, rightChains];
    }

    directionize(words, start, usedDimensions, otherDimensions, dimensionPool, wordCoordMap) {
        let chainWords = words.slice();
        chainWords.push(start);

        let allShifts = dimensionPool.map(c => 0);
        pairwise(chainWords, (a, b) => {
            allShifts = addCoords(allShifts, normalize(diffCoords(wordCoordMap[a], wordCoordMap[b])).map(c => Math.abs(c)));
        })

        const lastUsed = usedDimensions.length > 0 ? usedDimensions[usedDimensions.length - 1] : -1;
        const lastOther = otherDimensions.length > 0 ? otherDimensions[otherDimensions.length - 1] : -1;
        const noLastUsed = dimensionPool.filter((v, i) => i !== lastUsed);
        const noLastOther = noLastUsed.filter((v, i) => i !== lastOther);

        const pool = new Set(noLastOther.length > 0 ? noLastOther : noLastUsed);
        const available = allShifts.map((v, i) => [v, i]).filter(([v, i]) => pool.has(i));
        shuffle(available);
        const sorted = available.sort((a, b) => b[0] - a[0]);
        if (Math.random() < 0.95) {
            return [chainWords, sorted[0][1]];
        } else {
            return [chainWords, pickRandomItems(sorted, 1).picked[0][1]];
        }
    }

    applyChain(wordCoordMap, dimensionsUsed, chains) {
        if (chains.length === 0) {
            return [];
        }

        const mirrorPoint = (a, b, index) => {
            const p1 = wordCoordMap[a];
            const p2 = wordCoordMap[b];
            const diff = p2[index] - p1[index];
            const newPoint = p2.slice();
            newPoint[index] = p1[index] - diff;
            operations.push(createMirrorTemplate(a, b, dimensionNames[index]));
            return newPoint;
        }

        const setPoint = (a, b, index) => {
            const p1 = wordCoordMap[a];
            const p2 = wordCoordMap[b];
            const newPoint = p2.slice();
            newPoint[index] = p1[index];
            operations.push(createSetTemplate(a, b, dimensionNames[index]));
            return newPoint;
        }

        const scalePoint = (a, b, index) => {
            const p1 = wordCoordMap[a];
            const p2 = wordCoordMap[b];
            const diff = p2[index] - p1[index];
            const newPoint = p2.slice();
            const magnifier = 2;
            operations.push(createScaleTemplate(a, b, dimensionNames[index], magnifier));
            newPoint[index] = p1[index] + magnifier * diff;
            return newPoint;
        }

        const rotatePoint = (a, b, index) => {
            const p1 = wordCoordMap[a];
            const p2 = wordCoordMap[b];
            const dimensionPool = p1.map((p, i) => i).slice(0, 3) // Do not include time dimension;
            const plane = pickRandomItems(dimensionPool, 2).picked;
            plane.sort();
            let [m, n] = plane;
            dimensionsUsed.push.apply(dimensionsUsed, plane.filter(d => dimensionsUsed.indexOf(d) == -1));
            if (m === 0 && n === 2) {
                // ZX matches the right-hand rule for rotation, XZ (the reverse) does not
                [m, n] = [n, m];
            }
            const planeName = dimensionNames[m] + dimensionNames[n];
            const planeOp = (dimensionPool.length === 2) ? 'rotated' : (`<span class="highlight">${planeName}</span>-rotated`);
            let newPoint = p2.slice();
            let diffM = p2[m] - p1[m];
            let diffN = p2[n] - p1[n];
            newPoint[m] -= diffM;
            newPoint[n] -= diffN;
            if (coinFlip()) {
                newPoint[m] += diffN
                newPoint[n] += -diffM
                // &deg; = °, &#8635; = ↻
                operations.push(createRotationTemplate(a, b, planeOp, planeName, `<span class="pos-degree">90&deg;&#8635;</span>`));
            } else {
                newPoint[m] += -diffN
                newPoint[n] += diffM
                // &deg; = °, &#8634; = ↺
                operations.push(createRotationTemplate(a, b, planeOp, planeName, `<span class="neg-degree">-90&deg;&#8634;</span>`));
            }
            return newPoint;
        }

        const customizeCommands = (pool) => {
            let newPool = pool.filter(command => {
                if (command === setPoint && savedata.enableTransformSet) {
                    return true;
                } else if (command === mirrorPoint && savedata.enableTransformMirror) {
                    return true;
                } else if (command === scalePoint && savedata.enableTransformScale) {
                    return true;
                } else if (command === rotatePoint && savedata.enableTransformRotate) {
                    return true;
                } else {
                    return false;
                }
            });

            if (newPool.length === 0) {
                return [mirrorPoint];
            }

            return newPool;
        }

        let operations = [];
        let starterCommandPool = customizeCommands([setPoint, mirrorPoint, scalePoint, rotatePoint]);
        let commandPool = customizeCommands([mirrorPoint, mirrorPoint, mirrorPoint, scalePoint, scalePoint, rotatePoint, rotatePoint]);
        let usedCommands = [];

        let count = 0;
        let cpool = starterCommandPool;
        for (const [chain, dimension] of chains) {
            for (let i = 1; i < chain.length; i++) {
                const a = chain[i-1];
                const b = chain[i];
                const lastUsed = usedCommands?.[usedCommands.length - 1];
                const filteredPool = cpool.filter(c => c !== lastUsed);
                if (filteredPool.length !== 0) {
                    cpool = filteredPool;
                }

                const command = pickRandomItems(cpool, 1).picked[0];
                wordCoordMap[b] = command.call(null, a, b, dimension);
                usedCommands.push(command);
                cpool = commandPool;
            }
        }
        return operations;
    }

}

function createMirrorTemplate(a, b, dimension) {
    // Use HTML entities to avoid mojibake from non-ASCII symbols in generated bundle encodings.
    // &#8596; = ↔
    const relation = savedata.minimalMode ? `${dimension}&#8596;` : `is <span class="highlight">${dimension}</span>-mirrored across`;
    return `<span class="subject">${b}</span> <span class="relation">${relation}</span> <span class="subject">${a}</span>`;
}

function createScaleTemplate(a, b, dimension, scale) {
    // Minimal-mode should be unambiguous:
    // - mirror uses ↔
    // - scale uses × plus factor
    // &#8596; = ↔, &times; = ×
    const relation = savedata.minimalMode
        ? `${dimension}&times;${scale}`
        : `is <span class="highlight">${dimension}</span>-scaled <span class="highlight">${scale}&times;</span> from`;
    return `<span class="subject">${b}</span> <span class="relation">${relation}</span> <span class="subject">${a}</span>`;
}

function createSetTemplate(a, b, dimension) {
    if (savedata.minimalMode) {
        const relation = dimension + ' :=';
        return `<span class="subject">${b}</span> <span class="relation">${relation}</span> <span class="subject">${a}</span>`;
    } else {
        return `<span class="highlight">${dimension}</span> of <span class="subject">${b}</span> is set to <span class="highlight">${dimension}</span> of <span class="subject">${a}</span>`;
    }
}

function createRotationTemplate(a, b, planeOp, planeName, degree) {
    const relation = savedata.minimalMode ? `${planeName} ${degree}` : `is ${planeOp} ${degree} around`;
    return `<span class="subject">${b}</span> <span class="relation">${relation}</span> <span class="subject">${a}</span>`;
}



/* ---- js/generators/direction-pair-chooser.js ---- */


class DirectionPairChooser {
    pickTwoDistantWords(neighbors, deprioritizePoles=false) {
        const options = Object.keys(neighbors);
        let pool = [];
        const poles = options.filter(word => neighbors[word].length == 1);
        const pole_neighbors = options.filter(word => poles.some(pole => neighbors[pole].includes(word)))
        pool.push.apply(pool, poles);
        pool.push.apply(pool, pole_neighbors);
        if (deprioritizePoles) {
            const middle_nodes = options.filter(word => !pool.includes(word) && pole_neighbors.some(n => neighbors[n].includes(word)));
            pool.push.apply(pool, middle_nodes);
        }

        const useCloseNodes = deprioritizePoles ? oneOutOf(15) : false;
        const useMiddleNodes = deprioritizePoles ? oneOutOf(6) : oneOutOf(25);
        const useNearEdge = deprioritizePoles ? oneOutOf(2.5) : oneOutOf(4.5);
        const ranks = this._rankPairs(pool, neighbors);
        let startWord, endWord;
        if (Object.keys(neighbors).length <= 5) {
            [startWord, endWord] = pickRandomItems(ranks[0][1], 1).picked[0];
        } else if (useCloseNodes && ranks.length >= 4) {
            [startWord, endWord] = pickRandomItems(ranks[3][1], 1).picked[0];
        } else if (useMiddleNodes && ranks.length >= 3) {
            [startWord, endWord] = pickRandomItems(ranks[2][1], 1).picked[0];
        } else if (useNearEdge && ranks.length >= 2) {
            [startWord, endWord] = pickRandomItems(ranks[1][1], 1).picked[0];
        } else {
            [startWord, endWord] = pickRandomItems(ranks[0][1], 1).picked[0];
        }

        return [startWord, endWord];
    }

    _rankPairs(pool, neighbors) {
        let pairs = []
        for (let i = 0; i < pool.length; i++) {
            for (let j = i+1; j < pool.length; j++) {
                const start = pool[i];
                const end = pool[j];
                const dist = this._distanceBetween(start, end, neighbors)
                if (dist > 1) {
                    pairs.push([start, end, dist]);
                }
            }
        }

        let groups = {}
        for (const [a, b, dist] of pairs) {
            groups[dist] = groups?.[dist] ?? []
            groups[dist].push([a, b]);
        }

        return Object.entries(groups).sort(([distA, _], [distB, __]) => distB - distA);
    }

    _distanceBetween(start, end, neighbors) {
        let distance = 0;
        let layer = [start];
        let found = {[start]: true};
        while (layer.length > 0) {
            distance++;
            let newLayer = [];
            for (const node of layer) {
                for (const neighbor of neighbors[node]) {
                    if (found[neighbor]) {
                        continue;
                    }
                    if (neighbor === end) {
                        return distance;
                    }
                    newLayer.push(neighbor);
                    found[neighbor] = true;
                }
            }
            layer = newLayer;
        }
        return distance;
    }
}



/* ---- js/generators/incorrect-directions.js ---- */


class IncorrectDirections {
    findUnused(combinations, correctCoord) {
        let unused = [];
        let permutation = correctCoord.map(d => 0);
        let permutate = (i) => {
            if (i >= permutation.length) {
                if (!arraysEqual(permutation, correctCoord) && 
                    !arraysEqual(permutation, correctCoord.slice(0, 3).map(d => 0)) &&
                    combinations.findIndex(combo => arraysEqual(permutation, combo)) === -1) {
                    unused.push(permutation.slice());
                }
                return;
            }
            for (let direction of [-1, 0, 1]) {
                permutation[i] = direction;
                permutate(i+1);
            }
        }
        permutate(0);
        return unused;
    }

    createIncorrectConclusionCoords(usedCoords, correctCoord, diffCoord, hardModeDimensions) {
        let opposite = correctCoord.map(dir => -dir)
        let isUsingHardMode = hardModeDimensions && hardModeDimensions.length > 0;
        if (usedCoords.length <= 2) {
            return [opposite]; // Few premises == anything that isn't the opposite tends to be easy.
        } else if (usedCoords.length <= 3 && !isUsingHardMode && Math.random() < 0.5) {
            return [opposite];
        } else if (usedCoords.length <= 4 && !isUsingHardMode && Math.random() < 0.23) {
            return [opposite];
        }
        const dirCoords = removeDuplicateArrays(usedCoords);

        const dimensionPool = correctCoord.map((c, i) => i);
        let bannedDimensionShifts = new Set();
        for (const dimension of dimensionPool) {
            if (dirCoords.every(coord => coord[dimension] === 0)) {
                bannedDimensionShifts.add(dimension);
            }
        }

        const highest = diffCoord.map(x => Math.abs(x)).reduce((a, b) => Math.max(a, b));
        const allShiftedEqually = diffCoord.every(x => Math.abs(x) === highest);
        const shifts = allShiftedEqually ? [-1, 1] : [-2, -1, 1, 2];
        if (isUsingHardMode) {
            bannedDimensionShifts.add.apply(bannedDimensionShifts, dimensionPool.filter(d => !hardModeDimensions.some(h => h === d)));
        } else if (!allShiftedEqually) {
            bannedDimensionShifts.add.apply(bannedDimensionShifts, dimensionPool.filter(d => Math.abs(diffCoord[d]) === highest));
        }

        let combinations = [];
        for (const d of dimensionPool) {
            if (bannedDimensionShifts.has(d)) {
                continue;
            }

            for (const shift of shifts) {
                let newCombo = correctCoord.slice();
                newCombo[d] += shift;
                if (newCombo.some(d => Math.abs(d) > 1)) {
                    continue;
                }
                if (newCombo.slice(0, 3).every(d => d === 0)) {
                    continue;
                }
                combinations.push(newCombo);
                if (Math.abs(shift) == 1) {
                    combinations.push(newCombo);
                    combinations.push(newCombo);
                }
            }
        }

        let backupPool = this.findUnused(combinations, correctCoord);
        backupPool.push(opposite);
        backupPool.push(opposite);
        if (combinations.length !== 0 && !oneOutOf(11)) {
            return combinations;
        } else {
            return backupPool;
        }
    }

    chooseIncorrectCoord(usedCoords, correctCoord, diffCoord, hardModeDimensions) {
        const incorrectCoords = this.createIncorrectConclusionCoords(usedCoords, correctCoord, diffCoord, hardModeDimensions);
        const picked = pickRandomItems(incorrectCoords, 1).picked[0];
        return picked;
    }
}



/* ---- js/generators/direction.js ---- */


function diffCoords(a, b) {
    return b.map((c, i) => c - a[i]);
}

function addCoords(a, b) {
    return a.map((c, i) => c + b[i]);
}

function normalize(a) {
    return a.map(c => c/Math.abs(c) || 0);
}

function inverse(a) {
    return a.map(c => -c);
}

function findDirection(a, b) {
    return normalize(diffCoords(a, b));
}

function getConclusionCoords(wordCoordMap, startWord, endWord) {
    const [start, end] = [wordCoordMap[startWord], wordCoordMap[endWord]];
    const diffCoord = diffCoords(start, end);
    const conclusionCoord = normalize(diffCoord);
    return [diffCoord, conclusionCoord];
}

function taxicabDistance(a, b) {
    return a.map((v,i) => Math.abs(b[i] - v)).reduce((left,right) => left + right)
}

function pickWeightedRandomDirection(dirCoords, baseWord, neighbors, wordCoordMap) {
    const badTargets = (neighbors[baseWord] ?? []).map(word => wordCoordMap[word]);
    const base = wordCoordMap[baseWord];
    let pool = [];
    for (const dirCoord of dirCoords) {
        const endLocation = dirCoord.map((d,i) => d + base[i]);
        const distanceToClosest = badTargets
            .map(badTarget => taxicabDistance(badTarget, endLocation))
            .reduce((a,b) => Math.min(a,b), 999);
        if (distanceToClosest == 0) {
            pool.push(dirCoord)
        } else if (distanceToClosest == 1) {
            pool.push(dirCoord);
            pool.push(dirCoord);
            pool.push(dirCoord);
            pool.push(dirCoord);
            pool.push(dirCoord);
        } else if (distanceToClosest == 2) {
            pool.push(dirCoord);
            pool.push(dirCoord);
            pool.push(dirCoord);
            pool.push(dirCoord);
        } else if (distanceToClosest == 3) {
            pool.push(dirCoord);
            pool.push(dirCoord);
        } else {
            pool.push(dirCoord);
        }
    }

    return pickRandomItems(pool, 1).picked[0];
}

class Direction2D {
    constructor(enableHardMode=true, enableAnchor=false) {
        this.enableHardMode = enableHardMode;
        this.enableAnchor = enableAnchor;
    }

    pickDirection(baseWord, neighbors, wordCoordMap) {
        return pickWeightedRandomDirection(dirCoords.slice(1), baseWord, neighbors, wordCoordMap);
    }

    createDirectionStatement(a, b, dirCoord) {
        const direction = dirStringFromCoord(dirCoord);
        const reverseDirection = dirStringFromCoord(inverse(dirCoord));
        return {
            start: b,
            end: a,
            relation: `is ${direction} of`,
            reverse: `is ${reverseDirection} of`,
            relationMinimal: dirStringMinimal(dirCoord),
            reverseMinimal: dirStringMinimal(inverse(dirCoord)),
        }
    }

    initialCoord() {
        return [0, 0];
    }

    getName() {
        if (this.enableAnchor) {
            return "Anchor Space"
        } else {
            return "Space Two D";
        }
    }

    hardModeAllowed() {
        return this.enableHardMode;
    }

    hardModeLevel() {
        return savedata.space2DHardModeLevel;
    }

    getCountdown() {
        if (this.enableAnchor) {
            return savedata.overrideAnchorSpaceTime;
        } else {
            return savedata.overrideDirectionTime;
        }
    }

    shouldUseAnchor() {
        return this.enableAnchor;
    }
}

class Direction3D {
    constructor(enableHardMode=true) {
        this.enableHardMode = enableHardMode;
    }

    pickDirection(baseWord, neighbors, wordCoordMap) {
        return pickWeightedRandomDirection(dirCoords3D, baseWord, neighbors, wordCoordMap);
    }

    createDirectionStatement(a, b, dirCoord) {
        const direction = dirStringFromCoord(dirCoord);
        const reverseDirection = dirStringFromCoord(inverse(dirCoord));
        return {
            start: b,
            end: a,
            relation: `is ${direction} of`,
            reverse: `is ${reverseDirection} of`,
            relationMinimal: dirStringMinimal(dirCoord),
            reverseMinimal: dirStringMinimal(inverse(dirCoord)),
        }
    }

    initialCoord() {
        return [0, 0, 0];
    }

    getName() {
        return "Space Three D";
    }

    hardModeAllowed() {
        return this.enableHardMode;
    }

    hardModeLevel() {
        return savedata.space3DHardModeLevel;
    }

    getCountdown() {
        return savedata.overrideDirection3DTime;
    }

    shouldUseAnchor() {
        return false;
    }
}

class Direction4D {
    constructor(enableHardMode=true) {
        this.enableHardMode = enableHardMode;
    }

    pickDirection(baseWord, neighbors, wordCoordMap) {
        let dirCoord
        do {
            dirCoord = pickWeightedRandomDirection(dirCoords4D, baseWord, neighbors, wordCoordMap);
        } while (dirCoord.slice(0, 3).every(c => c === 0))
        return dirCoord
    }

    createDirectionStatement(a, b, dirCoord) {
        const direction = dirStringFromCoord(dirCoord);
        const reverseDirection = dirStringFromCoord(inverse(dirCoord));
        const timeName = timeMapping[dirCoord[3]];
        const reverseTimeName = reverseTimeNames[timeName];
        return {
            start: b,
            end: a,
            relation: `${timeName} ${direction} of`,
            reverse: `${reverseTimeName} ${reverseDirection} of`,
            relationMinimal: dirStringMinimal(dirCoord),
            reverseMinimal: dirStringMinimal(inverse(dirCoord)),
        }
    }

    initialCoord() {
        return [0, 0, 0, 0];
    }

    getName() {
        return "Space Time";
    }

    hardModeAllowed() {
        return this.enableHardMode;
    }

    hardModeLevel() {
        return savedata.space4DHardModeLevel;
    }

    getCountdown() {
        return savedata.overrideDirection4DTime;
    }

    shouldUseAnchor() {
        return false;
    }
}

function pickBaseWord(neighbors, branchesAllowed, bannedFromBranching=[]) {
    if (savedata.enableConnectionBranching === false) {
        branchesAllowed = false;
    }
    if (Object.values(neighbors).filter(list => list.length == 3).length >= 2) {
        branchesAllowed = false;
    }
    const options = Object.keys(neighbors);
    const neighborLimit = (!branchesAllowed || options.length <= 3) ? 1 : 2;
    let pool = [];
    for (const word of options) {
        if (neighbors[word] && neighbors[word].length > neighborLimit) {
            continue;
        }

        if (bannedFromBranching.includes(word) && neighbors[word].length > 1) {
            continue;
        }

        pool.push(word);
        pool.push(word);
        pool.push(word);
        if (neighbors[word] && neighbors[word].length == 1) {
            pool.push(word);
            pool.push(word);
            if (options.length >= 6) {
                pool.push(word);
                pool.push(word);
                pool.push(word);
                pool.push(word);
                pool.push(word);
            }
        }
    }
    const baseWord = pickRandomItems(pool, 1).picked[0];
    return baseWord;
}

class DirectionQuestion {
    constructor(directionGenerator) {
        this.generator = directionGenerator;
        this.pairChooser = new DirectionPairChooser();
        this.incorrectDirections = new IncorrectDirections();
    }

    create(length) {
        let startWord;
        let endWord;

        let conclusion;
        let conclusionCoord;
        let diffCoord;
        let [wordCoordMap, neighbors, premises, usedDirCoords] = [];
        let [numInterleaved, numTransforms] = this.getNumTransformsSplit(length);
        const branchesAllowed = Math.random() < 0.75;
        while (true) {
            if (this.generator.shouldUseAnchor()) {
                [wordCoordMap, neighbors, premises, usedDirCoords] = this.createWordMapAnchor(length, branchesAllowed);
            } else if (numInterleaved > 0) {
                [wordCoordMap, neighbors, premises, usedDirCoords] = this.createWordMapInterleaved(length);
            } else {
                [wordCoordMap, neighbors, premises, usedDirCoords] = this.createWordMap(length, branchesAllowed);
            }
            [startWord, endWord] = this.pairChooser.pickTwoDistantWords(neighbors);
            [diffCoord, conclusionCoord] = getConclusionCoords(wordCoordMap, startWord, endWord);
            if (conclusionCoord.slice(0, 3).some(c => c !== 0)) {
                break;
            }
        }

        let operations;
        let hardModeDimensions;
        if (numTransforms > 0) {
            [wordCoordMap, operations, hardModeDimensions] = new SpaceHardMode(numTransforms).basicHardMode(wordCoordMap, startWord, endWord, conclusionCoord);
            [diffCoord, conclusionCoord] = getConclusionCoords(wordCoordMap, startWord, endWord);
            if (numInterleaved > 0) {
                premises.push(...operations);
                operations = [];
                hardModeDimensions = conclusionCoord.map((d,i) => i);
            }
        }

        let isValid;
        if (coinFlip()) { // correct
            isValid = true;
            conclusion = this.generator.createDirectionStatement(startWord, endWord, conclusionCoord);
        }
        else {            // wrong
            isValid = false;
            const incorrectCoord = this.incorrectDirections.chooseIncorrectCoord(usedDirCoords, conclusionCoord, diffCoord, hardModeDimensions);
            conclusion = this.generator.createDirectionStatement(startWord, endWord, incorrectCoord);
        }

        if (numInterleaved === 0) {
            premises = scramble(premises);
        }
        premises = premises.map(p => createPremiseHTML(p));
        conclusion = createBasicPremiseHTML(conclusion);
        const countdown = this.generator.getCountdown();
        const totalTransforms = this.getNumTransformsSplit(length).reduce((a, b) => a + b, 0);
        let modifiers = [];
        if (totalTransforms > 0) {
            modifiers.push(`op${totalTransforms}`);
        }
        if (numInterleaved > 0) {
            modifiers.push(`interleave`);
        }
        return {
            category: this.generator.getName(),
            type: normalizeString(this.generator.getName()),
            ...((totalTransforms > 0 || savedata.widePremises) && { plen: length }),
            modifiers,
            startedAt: new Date().getTime(),
            wordCoordMap,
            isValid,
            premises,
            operations,
            conclusion,
            ...(countdown && { countdown }),
        }
    }

    createAnalogy(length) {
        let isValid;
        let isValidSame;
        let [wordCoordMap, neighbors, premises, usedDirCoords, operations] = [];
        let [a, b, c, d] = [];
        let [numInterleaved, numTransforms] = this.getNumTransformsSplit(length);
        const branchesAllowed = Math.random() > 0.2;
        const flip = coinFlip();
        while (flip !== isValidSame) {
            if (this.generator.shouldUseAnchor()) {
                [wordCoordMap, neighbors, premises, usedDirCoords] = this.createWordMapAnchor(length, branchesAllowed);
            } else if (numInterleaved > 0) {
                [wordCoordMap, neighbors, premises, usedDirCoords] = this.createWordMapInterleaved(length);
            } else {
                [wordCoordMap, neighbors, premises, usedDirCoords] = this.createWordMap(length, branchesAllowed);
            }
            [a, b, c, d] = pickRandomItems(Object.keys(wordCoordMap), 4).picked;
            if (numTransforms > 0) {
                const [startWord, endWord] = pickRandomItems([a, b, c, d], 2).picked;
                const [diffCoord, conclusionCoord] = getConclusionCoords(wordCoordMap, startWord, endWord);
                let _x;
                [wordCoordMap, operations, _x] = new SpaceHardMode(numTransforms).basicHardMode(wordCoordMap, startWord, endWord, conclusionCoord);
                if (numInterleaved > 0) {
                    premises.push(...operations);
                    operations = [];
                }
            }
            isValidSame = arraysEqual(findDirection(wordCoordMap[a], wordCoordMap[b]), findDirection(wordCoordMap[c], wordCoordMap[d]));
        }
        let conclusion = analogyTo(a, b);
        if (coinFlip()) {
            conclusion += pickAnalogyStatementSame();
            isValid = isValidSame;
        } else {
            conclusion += pickAnalogyStatementDifferent();
            isValid = !isValidSame;
        }
        conclusion += analogyTo(c, d);

        premises = premises.map(p => createPremiseHTML(p));
        const countdown = this.generator.getCountdown();
        const totalTransforms = this.getNumTransformsSplit(length).reduce((a, b) => a + b, 0);
        let modifiers = [];
        if (totalTransforms > 0) {
            modifiers.push(`op${totalTransforms}`);
        }
        if (numInterleaved > 0) {
            modifiers.push(`interleave`);
        }
        return {
            category: 'Analogy: ' + this.generator.getName(),
            type: normalizeString(this.generator.getName()),
            modifiers,
            startedAt: new Date().getTime(),
            wordCoordMap,
            isValid,
            premises,
            ...(savedata.widePremises && { plen: length }),
            operations,
            conclusion,
            ...(countdown && { countdown }),
        }
    }

    getNumTransformsSplit(numPremises) {
        const totalTransforms = this.generator.hardModeLevel();
        if (!this.generator.hardModeAllowed() || totalTransforms === 0) {
            return [0, 0];
        }

        if (!savedata.enableTransformInterleave) {
            return [0, totalTransforms];
        }
        let interleaveCount = Math.max(0, Math.min(totalTransforms - 1, numPremises - 1));
        return [interleaveCount, totalTransforms - interleaveCount];
    }

    createWordMapCommands(length) {
        const words = createStimuli(length + 1);
        let commands = words.map(w => ['move', w]);
        let [interleaveCount, _] = this.getNumTransformsSplit(length);
        if (interleaveCount === 0) {
            return [words, commands];
        }

        let transformCommands = []
        for (let i = 0; i < interleaveCount; i++) {
            transformCommands.push(['transform']);
        }
        let tailCommands = commands.slice(1, commands.length);
        let merged = frontHeavyIntervalMerge(tailCommands, transformCommands);
        merged.unshift(commands[0]);

        return [words, merged];
    }

    createWordMapInterleaved(length) {
        let [words, commands] = this.createWordMapCommands(length);
        const initialCoord = this.generator.initialCoord();
        let wordCoordMap = {[words[0]]: initialCoord };
        let neighbors = {[words[0]]: []};
        let premiseChunks = [[]];
        let operations = [];
        let usedDirCoords = [];

        let lastWord = words[0];
        let dimensionPool = repeatArrayUntil(shuffle(initialCoord.map((d, i) => i)), commands.length * 2);
        let dimensionIndex = 0;
        for (let i = 1; i < commands.length; i++) {
            let command = commands[i];
            let action = command[0];
            if (action === 'transform') {
                if (premiseChunks[premiseChunks.length - 1].length !== 0) {
                    premiseChunks.push([]);
                }
                let [newWordMap, operation] = new SpaceHardMode(0).oneTransform(wordCoordMap, lastWord, dimensionPool[dimensionIndex], dimensionPool[dimensionIndex+1]);
                dimensionIndex++;
                wordCoordMap = newWordMap;
                operations.push(operation);
            } else {
                const baseWord = lastWord;
                const nextWord = command[1];
                const dirCoord = this.generator.pickDirection(baseWord, neighbors, wordCoordMap);
                wordCoordMap[nextWord] = addCoords(wordCoordMap[baseWord], dirCoord);
                const premise = this.generator.createDirectionStatement(baseWord, nextWord, dirCoord);
                premiseChunks[premiseChunks.length - 1].push(premise);
                usedDirCoords.push(dirCoord);
                neighbors[baseWord] = neighbors[baseWord] ?? [];
                neighbors[baseWord].push(nextWord);
                neighbors[nextWord] = neighbors[nextWord] ?? [];
                neighbors[nextWord].push(baseWord);
                lastWord = nextWord;
            }
        }

        if (premiseChunks[premiseChunks.length - 1].length === 0) {
            premiseChunks.pop();
        }

        let divisions = words.length - 2;
        let unbreakableDivisions = Math.round((100 - savedata.scrambleFactor) * divisions / 100);
        premiseChunks = premiseChunks.map(chunk => {
            let chosenDivisions = Math.min(unbreakableDivisions, chunk.length - 1);
            unbreakableDivisions -= chosenDivisions;
            return scrambleWithLimit(chunk, chosenDivisions);
        });

        let merged = interleaveArrays(premiseChunks, operations);
        let premises = merged.flatMap(p => {
            if (Array.isArray(p)) {
                return p;
            } else {
                return [p];
            }
        });

        return [wordCoordMap, neighbors, premises, usedDirCoords];
    }

    createWordMap(length, branchesAllowed) {
        const baseWords = createStimuli(length + 1);
        const start = baseWords[0];
        const words = baseWords.slice(1, baseWords.length);
        let wordCoordMap = {[start]: this.generator.initialCoord() };
        let neighbors = {[start]: []};
        return this.buildOntoWordMap(words, wordCoordMap, neighbors, branchesAllowed);
    }

    createWordMapAnchor(length, branchesAllowed) {
        const star = '[svg]0[/svg]';
        const circle = '[svg]1[/svg]';
        const triangle = '[svg]2[/svg]';
        const heart = '[svg]3[/svg]';

        let result;
        for (let i = 0; i < 10; i++) {
            const words = createStimuli(length, [star, circle, triangle, heart]);
            let wordCoordMap = {
                [star]: [0, 1],
                [circle]: [1, 0],
                [triangle]: [-1, 0],
                [heart]: [0, -1],
            };

            let starters = [star, circle, triangle, heart];
            shuffle(starters);
            const bannedFromBranching = [starters[1], starters[2], starters[3]];
            let neighbors;
            if (branchesAllowed) {
                neighbors = {
                    [starters[0]]: [starters[1], starters[2], starters[3]],
                    [starters[1]]: [starters[0]],
                    [starters[2]]: [starters[0]],
                    [starters[3]]: [starters[0]],
                };
            } else {
                neighbors = {
                    [starters[0]]: [starters[1], starters[2]],
                    [starters[1]]: [starters[0], starters[3]],
                    [starters[2]]: [starters[0]],
                    [starters[3]]: [starters[1]],
                };
            }

            result = this.buildOntoWordMap(words, wordCoordMap, neighbors, branchesAllowed, bannedFromBranching);
            const anchorConnections = starters.map(s => neighbors[s].length).reduce((a, b) => a + b, 0);
            if (anchorConnections >= 8) {
                break;
            }
        }
        return result;
    }

    buildOntoWordMap(words, wordCoordMap, neighbors, branchesAllowed, bannedFromBranching=[]) {
        let premiseMap = {};
        let usedDirCoords = [];

        for (const nextWord of words) {
            const baseWord = pickBaseWord(neighbors, branchesAllowed, bannedFromBranching);
            const dirCoord = this.generator.pickDirection(baseWord, neighbors, wordCoordMap);
            wordCoordMap[nextWord] = addCoords(wordCoordMap[baseWord], dirCoord);
            premiseMap[premiseKey(baseWord, nextWord)] = this.generator.createDirectionStatement(baseWord, nextWord, dirCoord);
            usedDirCoords.push(dirCoord);
            neighbors[baseWord] = neighbors[baseWord] ?? [];
            neighbors[baseWord].push(nextWord);
            neighbors[nextWord] = neighbors[nextWord] ?? [];
            neighbors[nextWord].push(baseWord);
        }

        let premises = orderPremises(premiseMap, neighbors);
        if (savedata.widePremises) {
            premises = createWidePremises(premises, premiseMap);
        }

        return [wordCoordMap, neighbors, premises, usedDirCoords];
    }
}

function createDirectionGenerator(length) {
    return {
        question: new DirectionQuestion(new Direction2D()),
        premiseCount: getPremisesFor('overrideDirectionPremises', length),
        weight: savedata.overrideDirectionWeight,
    };
}

function createDirection3DGenerator(length) {
    return {
        question: new DirectionQuestion(new Direction3D()),
        premiseCount: getPremisesFor('overrideDirection3DPremises', length),
        weight: savedata.overrideDirection3DWeight,
    };
}

function createDirection4DGenerator(length) {
    return {
        question: new DirectionQuestion(new Direction4D()),
        premiseCount: getPremisesFor('overrideDirection4DPremises', length),
        weight: savedata.overrideDirection4DWeight,
    };
}

function createAnchorSpaceGenerator(length) {
    return {
        question: new DirectionQuestion(new Direction2D(false, true)),
        premiseCount: getPremisesFor('overrideAnchorSpacePremises', length),
        weight: savedata.overrideAnchorSpaceWeight,
    };
}



/* ---- js/generators/meta.js ---- */


function applyMeta(premises, relationFinder) {
    // Randomly choose a number of meta-relations
    const numOfMetaRelations = 1 + Math.floor(Math.random() * Math.floor(premises.length / 2));
    let _premises = pickRandomItems(premises, numOfMetaRelations * 2);
    premises = [ ..._premises.remaining ];

    while (_premises.picked.length) {

        const choosenPair = pickRandomItems(_premises.picked, 2);
        const negations = choosenPair.picked.map(p => /is-negated/.test(p));
        const relations = choosenPair.picked.map(relationFinder);

        // Generate substitution string
        let substitution;
        const [a, b] = [
                ...choosenPair.picked[0]
                .matchAll(/<span class="subject">(.*?)<\/span>/g)
            ]
            .map(m => m[1]);
        const isSame = negations[0] ^ negations[1] ^ (relations[0] === relations[1]);
        if (isSame) {
            substitution = pickNegatable([
                `$1 is same as <span class="is-meta">(<span class="subject">${a}</span> to <span class="subject">${b}</span>)</span> to $3`,
                `$1 is <span class="is-negated">opposite of</span> <span class="is-meta">(<span class="subject">${a}</span> to <span class="subject">${b}</span>)</span> to $3`
            ]);
        } else {
            substitution = pickNegatable([
                `$1 is opposite of <span class="is-meta">(<span class="subject">${a}</span> to <span class="subject">${b}</span>)</span> to $3`,
                `$1 is <span class="is-negated">same as</span> <span class="is-meta">(<span class="subject">${a}</span> to <span class="subject">${b}</span>)</span> to $3`
            ]);
        }

        // Replace relation with meta-relation via substitution string
        const metaPremise = choosenPair.picked[1]
            .replace(/(<span class="relation">)(.*)(<\/span>) (?=<span class="subject">)/, substitution);

        // Push premise and its corresponding meta-premise
        premises.push(choosenPair.picked[0], metaPremise);

        // Update _premises so that it doesn't end up in an infinite loop
        _premises = { picked: choosenPair.remaining };
    }
    return premises;
}



/* ---- js/generators/distinction.js ---- */


function createSamePremise(a, b) {
    return {
        start: a,
        end: b,
        relation: 'is same as',
        reverse: 'is opposite of',
        relationMinimal: '=',
        reverseMinimal: 'â˜',
    }
}

function createOppositePremise(a, b) {
    return {
        start: a,
        end: b,
        relation: 'is opposite of',
        reverse: 'is same as',
        relationMinimal: 'â˜',
        reverseMinimal: '=',
    }
}

class DistinctionQuestion {
    generate(length) {
        length++;
    
        const words = createStimuli(length);

        let premiseMap = {};
        let first = words[0];
        let bucketMap = { [first]: 0 };
        let neighbors = { [first]: [] };

        const chanceOfBranching = {
            5: 0.60,
            6: 0.55,
            7: 0.50,
            8: 0.45,
            9: 0.40,
            10: 0.35,
        }[words.length] ?? (words.length > 10 ? 0.3 : 0.6);
        for (let i = 1; i < words.length; i++) {
            const source = pickBaseWord(neighbors, Math.random() < chanceOfBranching);
            const target = words[i];

            const key = premiseKey(source, target);
            if (coinFlip()) {
                premiseMap[key] = createSamePremise(source, target);
                bucketMap[target] = bucketMap[source];
            } else {
                premiseMap[key] = createOppositePremise(source, target);
                bucketMap[target] = (bucketMap[source] + 1) % 2;
            }

            neighbors[source] = neighbors?.[source] ?? [];
            neighbors[target] = neighbors?.[target] ?? [];
            neighbors[target].push(source);
            neighbors[source].push(target);
        }

        let premises = orderPremises(premiseMap, neighbors);
        if (savedata.widePremises) {
            premises = createWidePremises(premises, premiseMap);
        }

        let buckets = [
            Object.keys(bucketMap).filter(w => bucketMap[w] === 0),
            Object.keys(bucketMap).filter(w => bucketMap[w] === 1)
        ]

        premises = scramble(premises);
        premises = premises.map(p => createPremiseHTML(p, false));

        if (savedata.enableMeta && !savedata.minimalMode && !savedata.widePremises) {
            premises = applyMeta(premises, p => p.match(/<span class="relation">(?:<span class="is-negated">)?(.*?)<\/span>/)[1]);
        }

        this.premises = premises;
        this.buckets = buckets;
        this.neighbors = neighbors;
        this.bucketMap = bucketMap;
    }

    createAnalogy(length) {
        this.generate(length);
        const [a, b, c, d] = pickRandomItems([...this.buckets[0], ...this.buckets[1]], 4).picked;

        const [
            indexOfA,
            indexOfB,
            indexOfC,
            indexOfD
        ] = [
            Number(this.buckets[0].indexOf(a) !== -1),
            Number(this.buckets[0].indexOf(b) !== -1),
            Number(this.buckets[0].indexOf(c) !== -1),
            Number(this.buckets[0].indexOf(d) !== -1)
        ];
        const isValidSame = indexOfA === indexOfB && indexOfC === indexOfD
                   || indexOfA !== indexOfB && indexOfC !== indexOfD;

        let conclusion = analogyTo(a, b);
        let isValid;
        if (coinFlip()) {
            conclusion += pickAnalogyStatementSameTwoOptions();
            isValid = isValidSame;
        } else {
            conclusion += pickAnalogyStatementDifferentTwoOptions();
            isValid = !isValidSame;
        }
        conclusion += analogyTo(c, d);
        const countdown = this.getCountdown();

        return {
            category: "Analogy: Distinction",
            type: "distinction",
            startedAt: new Date().getTime(),
            buckets: this.buckets,
            premises: this.premises,
            ...(savedata.widePremises && { plen: length }),
            isValid,
            conclusion,
            ...(countdown && { countdown }),
        };
    }

    create(length) {
        this.generate(length);

        let [startWord, endWord] = new DirectionPairChooser().pickTwoDistantWords(this.neighbors);
        if (coinFlip()) {
            this.conclusion = createBasicPremiseHTML(createSamePremise(startWord, endWord), false);
            this.isValid = this.bucketMap[startWord] === this.bucketMap[endWord];
        } else {
            this.conclusion = createBasicPremiseHTML(createOppositePremise(startWord, endWord), false);
            this.isValid = this.bucketMap[startWord] !== this.bucketMap[endWord];
        }

        const countdown = this.getCountdown();
        return {
            category: "Distinction",
            type: "distinction",
            startedAt: new Date().getTime(),
            buckets: this.buckets,
            premises: this.premises,
            isValid: this.isValid,
            conclusion: this.conclusion,
            ...(savedata.widePremises && { plen: length }),
            ...(countdown && { countdown }),
        };
    }
    
    getCountdown() {
        return savedata.overrideDistinctionTime;
    }
}

function createDistinctionGenerator(length) {
    return {
        question: new DistinctionQuestion(),
        premiseCount: getPremisesFor('overrideDistinctionPremises', length),
        weight: savedata.overrideDistinctionWeight,
    };
}



/* ---- js/generators/linear.js ---- */


function pickLinearPremise(a, b, comparison, reverseComparison, min, minRev) {
    if (savedata.minimalMode) {
        comparison = min;
        reverseComparison = minRev;
    } else {
        comparison = comparison;
        reverseComparison = reverseComparison;
    }
    const ps = [
    `<span class="subject">${a}</span> <span class="relation">${comparison}</span> <span class="subject">${b}</span>`,
    `<span class="subject">${a}</span> <span class="relation"><span class="is-negated">${reverseComparison}</span></span> <span class="subject">${b}</span>`,
    ];
    return pickNegatable(ps);
}

function startHeavyWeightedChoiceInRange(start, end) {
    const weights = Array.from({ length: end - start + 1 }, (_, i) => end - start - i + 1);
    const totalWeight = weights.reduce((acc, val) => acc + val, 0);
    const randomNum = Math.random() * totalWeight;
    let sum = 0;

    for (let i = start; i <= end; i++) {
        sum += weights[i - start];
        if (randomNum <= sum) {
            return i
        }
    }
    return end;
}

function findTwoWordIndexes(words) {
    const minSpan = Math.min(words.length - 1, words.length < 8 ? 3 : 4);
    const selectedSpan = startHeavyWeightedChoiceInRange(minSpan, words.length - 1);
    const defaultStartOption = Math.floor((words.length - selectedSpan - 1) / 2);
    const devianceFromDefault = startHeavyWeightedChoiceInRange(0, defaultStartOption)
    let start = defaultStartOption + devianceFromDefault * (coinFlip() ? 1 : -1);
    start = Math.max(0, Math.min(start, words.length - selectedSpan - 1));
    const end = start + selectedSpan;
    return [start, end];
}

class LinearGenerator {
    constructor(name, prev, prevMin, next, nextMin, equal, equalMin) {
        this.name = name;
        this.prev = prev;
        this.prevMin = prevMin;
        this.next = next;
        this.nextMin = nextMin;
        this.equal = equal;
        this.equalMin = equalMin;
    }

    forwards(a, b) {
        return {
            start: a,
            end: b,
            relation: this.prev,
            reverse: this.next,
            relationMinimal: this.prevMin,
            reverseMinimal: this.nextMin,
        };
    }

    backwards(a, b) {
        return {
            start: a,
            end: b,
            relation: this.next,
            reverse: this.prev,
            relationMinimal: this.nextMin,
            reverseMinimal: this.prevMin,
        };
    }

    createLinearPremise(a, b) {
        if (coinFlip()) {
            return this.forwards(a, b);
        } else {
            return this.backwards(b, a);
        }
    }

    createBacktrackingLinearPremise(a, b, options, negationOptions) {
        if (coinFlip()) {
            [a, b] = [b, a];
            options = options.map(choice => -choice);
            negationOptions = negationOptions.map(choice => -choice);
        }
        const choice = pickRandomItems(options, 1).picked[0] + 1;
        const relations = [this.prev, this.equal, this.next];
        const relationsMin = [this.prevMin, this.equalMin, this.nextMin];
        const negatedChoice = pickRandomItems(negationOptions.map(o => o+1).filter(x => x !== choice), 1).picked[0];
        return pickLinearPremise(a, b, relations[choice], relations[negatedChoice], relationsMin[choice], relationsMin[negatedChoice]);
    }

    getName() {
        return this.name;
    }
}

const MORE_LESS = new LinearGenerator('Comparison', 'is less than', '<', 'is more than', '>', 'is equal to', '=');
const BEFORE_AFTER = new LinearGenerator('Temporal', 'is before', '[svg]4[/svg]', 'is after', '[svg]5[/svg]', 'is at', '=');
const CONTAINS_WITHIN = new LinearGenerator('Contains', 'contains', 'âŠƒ', 'is within', 'âŠ‚', 'is the same as', '=');
const LEFT_RIGHT = new LinearGenerator('Horizontal', 'is left of', '[svg]9[/svg]', 'is right of', '[svg]8[/svg]', 'is at', '=');
const TOP_UNDER = new LinearGenerator('Vertical', 'is on top of', '[svg]7[/svg]', 'is under', '[svg]6[/svg]', 'is at', '=');

class LinearQuestion {
    constructor(linearGenerator) {
        this.generator = linearGenerator;
    }

    generate(length) {
        let isValid;
        let premises;
        let conclusion;
        let buckets;
        let bucketMap;

        const words = createStimuli(length + 1);

        if (this.isBacktrackingEnabled()) {
            [premises, conclusion, isValid, buckets, bucketMap] = this.buildBacktrackingMap(words);
        } else {
            [premises, conclusion, isValid] = this.buildLinearMap(words);
        }

        premises = scramble(premises);
        premises = premises.map(p => createPremiseHTML(p));

        if (savedata.enableMeta && !savedata.minimalMode && !savedata.widePremises) {
            premises = applyMeta(premises, p => p.match(/<span class="relation">(?:<span class="is-negated">)?(.*?)<\/span>/)[1]);
        }

        this.premises = premises;
        this.conclusion = conclusion;
        this.isValid = isValid;
        if (this.isBacktrackingEnabled()) {
            this.buckets = buckets;
            this.bucketMap = bucketMap;
        } else {
            this.bucket = words;
        }
    }

    buildLinearMap(words) {
        let premises = [];
        let conclusion;
        let isValid;

        for (let i = 0; i < words.length - 1; i++) {
            const curr = words[i];
            const next = words[i + 1];

            premises.push(this.generator.createLinearPremise(curr, next));
        }

        if (savedata.widePremises) {
            premises = createWidePremises(premises);
        }
        const [i, j] = findTwoWordIndexes(words);

        if (coinFlip()) {
            conclusion = createBasicPremiseHTML(this.generator.createLinearPremise(words[i], words[j]));
            isValid = i < j;
        } else {
            conclusion = createBasicPremiseHTML(this.generator.createLinearPremise(words[j], words[i]));
            isValid = i > j;
        }

        return [premises, conclusion, isValid];
    }


    buildBacktrackingMap(words) {
        const chanceOfBranching = {
            5: 0.60,
            6: 0.55,
            7: 0.50,
            8: 0.45,
            9: 0.40,
            10: 0.35,
        }[words.length] ?? (words.length > 10 ? 0.3 : 0.6);

        const first = words[0];
        let idealDistance = null;
        if (words.length >= 5) {
            if (oneOutOf(8)) {
                idealDistance = 0;
            } else if (oneOutOf(9)) {
                idealDistance = 1;
            } else if (oneOutOf(10)) {
                idealDistance = 2;
            }
        }
        let premiseMap, bucketMap, neighbors;
        let a, b;
        const isIdealScenario = (a, b) => {
            if (idealDistance === null) {
                return true;
            }
            return Math.abs(bucketMap[a] - bucketMap[b]) === idealDistance;
        };

        for (let tries = 0; tries < 9999; tries++) {
            premiseMap = {};
            bucketMap = { [first]: 0 };
            neighbors = { [first]: [] };
            for (let i = 1; i < words.length; i++) {
                const source = pickBaseWord(neighbors, Math.random() < chanceOfBranching);
                const target = words[i];
                const key = premiseKey(source, target);

                let forwardChance = 0.5;
                const neighborList = neighbors[source];
                const firstNeighbor = neighborList[0];
                if (firstNeighbor && neighborList.every(word => bucketMap[word] === bucketMap[firstNeighbor])) {
                    if (bucketMap[firstNeighbor] + 1 == bucketMap[source]) {
                        forwardChance = 0.6;
                    } else {
                        forwardChance = 0.4;
                    }
                }
                if (Math.random() < forwardChance) {
                    premiseMap[key] = this.generator.createLinearPremise(source, target);
                    bucketMap[target] = bucketMap[source] + 1;
                } else {
                    premiseMap[key] = this.generator.createLinearPremise(target, source);
                    bucketMap[target] = bucketMap[source] - 1;
                }

                neighbors[source] = neighbors?.[source] ?? [];
                neighbors[target] = neighbors?.[target] ?? [];
                neighbors[target].push(source);
                neighbors[source].push(target);
            }
            [a, b] = new DirectionPairChooser().pickTwoDistantWords(neighbors, true);
            if (isIdealScenario(a, b)) {
                break;
            }
        }

        const bucketTargets = Object.values(bucketMap);
        const low = bucketTargets.reduce((a, b) => Math.min(a, b));
        const high = bucketTargets.reduce((a, b) => Math.max(a, b));
        let buckets = Array(high - low + 1).fill(0);
        buckets = buckets.map(x => []);
        for (const word in bucketMap) {
            buckets[bucketMap[word] - low].push(word);
        }

        let premises = orderPremises(premiseMap, neighbors);
        if (savedata.widePremises) {
            premises = createWidePremises(premises, premiseMap);
        }
        const comparison = bucketMap[a] === bucketMap[b] ? 0 : (bucketMap[a] < bucketMap[b] ? -1 : 1)
        let conclusion, isValid;
        if (coinFlip()) {
            conclusion = this.generator.createBacktrackingLinearPremise(a, b, [comparison], [-1, 0, 1].filter(o => o !== comparison));
            isValid = true;
        } else {
            let options = [-1, 0, 1].filter(o => o !== comparison);
            const distance = Math.abs(bucketMap[a] - bucketMap[b]);
            const includeZero = {
                1: oneOutOf(2),
                2: oneOutOf(4),
                3: oneOutOf(6),
                4: oneOutOf(8),
            }?.[distance] ?? oneOutOf(12);
            if (!includeZero) {
                options = options.filter(o => o !== 0);
            }
            conclusion = this.generator.createBacktrackingLinearPremise(a, b, options, [comparison]);
            isValid = false;
        }

        return [premises, conclusion, isValid, buckets, bucketMap];
    }

    indexOfWord(word) {
        if (this.isBacktrackingEnabled()) {
            return this.bucketMap[word];
        } else {
            return this.bucket.indexOf(word);
        }
    }

    createAnalogy(length) {
        this.generate(length);
        let a, b, c, d;
        if (this.isBacktrackingEnabled()) {
            [a, b, c, d] = pickRandomItems(Object.keys(this.bucketMap), 4).picked
        } else {
            [a, b, c, d] = pickRandomItems(this.bucket, 4).picked;
        }

        const [indexOfA, indexOfB] = [this.indexOfWord(a), this.indexOfWord(b)];
        const [indexOfC, indexOfD] = [this.indexOfWord(c), this.indexOfWord(d)];
        const isValidSame = indexOfA > indexOfB && indexOfC > indexOfD
                   || indexOfA < indexOfB && indexOfC < indexOfD
                   || indexOfA === indexOfB && indexOfC === indexOfD;

        let conclusion = analogyTo(a, b);
        let isValid;
        if (coinFlip()) {
            conclusion += pickAnalogyStatementSame();
            isValid = isValidSame;
        } else {
            conclusion += pickAnalogyStatementDifferent();
            isValid = !isValidSame;
        }
        conclusion += analogyTo(c, d);

        const countdown = this.getCountdown();
        return {
            category: 'Analogy: ' + this.generator.getName(),
            type: normalizeString('linear'),
            startedAt: new Date().getTime(),
            ...(this.bucket && { bucket: this.bucket }),
            ...(this.buckets && { buckets: this.buckets, modifiers: ['180'] }),
            premises: this.premises,
            ...(savedata.widePremises && { plen: length }),
            isValid,
            conclusion,
            ...(countdown && { countdown }),
        }
    }

    create(length) {
        this.generate(length);
        const countdown = this.getCountdown();
        return {
            category: this.generator.getName(),
            type: normalizeString('linear'),
            startedAt: new Date().getTime(),
            ...(this.bucket && { bucket: this.bucket }),
            ...(this.buckets && { buckets: this.buckets, modifiers: ['180'] }),
            premises: this.premises,
            isValid: this.isValid,
            conclusion: this.conclusion,
            ...(savedata.widePremises && { plen: length }),
            ...(countdown && { countdown }),
        }
    }

    getCountdown(offset=0) {
        return savedata.overrideLinearTime ? savedata.overrideLinearTime + offset : null;
    }

    isBacktrackingEnabled() {
        return savedata.enableBacktrackingLinear;
    }
}

function createLinearQuestion(wording) {
    if (wording === 'comparison') {
        return new LinearQuestion(MORE_LESS);
    } else if (wording === 'temporal') {
        return new LinearQuestion(BEFORE_AFTER);
    } else if (wording === 'topunder') {
        return new LinearQuestion(TOP_UNDER);
    } else if (wording === 'contains') {
        return new LinearQuestion(CONTAINS_WITHIN);
    } else {
        return new LinearQuestion(LEFT_RIGHT);
    }
}

function getEnabledLinearWordings() {
    return savedata.linearWording.split(',').filter(wording => wording && wording.length > 0);
}

function getEnabledLinearWeights() {
    const wordings = getEnabledLinearWordings();
    const weights = [
        [ 'leftright', savedata.overrideLeftRightWeight ],
        [ 'topunder', savedata.overrideTopUnderWeight ],
        [ 'comparison', savedata.overrideComparisonWeight ],
        [ 'temporal', savedata.overrideTemporalWeight ],
        [ 'contains', savedata.overrideContainsWeight ],
    ].filter(w => wordings.includes(w[0]));
    return weights;
}

function createLinearGenerators(length) {
    length = getPremisesFor("overrideLinearPremises", length);
    let generators = [];
    for (const [wording, weight] of getEnabledLinearWeights()) {
        generators.push({ question: createLinearQuestion(wording), premiseCount: length, weight: weight });
    }
    return generators;
}



/* ---- js/generators/syllogism.js ---- */


function getSyllogism(s, p, m, rule) {
    const _forms = pickNegatable(forms);
    let major = _forms[rule[0]];
    let minor = _forms[rule[1]];
    let conclusion = _forms[rule[2]];

    let figure = +rule[3];

    if (figure === 1) {
        major = major.replace("$", m);
        major = major.replace("$", p);

        minor = minor.replace("$", s);
        minor = minor.replace("$", m);
    } else if (figure === 2) {
        major = major.replace("$", p);
        major = major.replace("$", m);

        minor = minor.replace("$", s);
        minor = minor.replace("$", m);
    } else if (figure === 3) {
        major = major.replace("$", m);
        major = major.replace("$", p);

        minor = minor.replace("$", m);
        minor = minor.replace("$", s);
    } else if (figure === 4) {
        major = major.replace("$", p);
        major = major.replace("$", m);

        minor = minor.replace("$", m);
        minor = minor.replace("$", s);
    }

    conclusion = conclusion.replace("$", s);
    conclusion = conclusion.replace("$", p);

    return [major, minor, conclusion];
}

function getRandomInvalidRule() {
    let rule;
    while (!rule || validRules.includes(rule)) {
        rule = "";
        for (let i = 0; i < 3; i++) {
            rule += Math.floor(Math.random() * 4); // Form
        }
        rule += 1 + Math.floor(Math.random() * 4); // Figure
    }
    return rule;
}


function isPremiseSimilarToConlusion(premises, conclusion) {
    const subjectsOfPremises = premises.map(p => extractSubjects(p));
    const subjectsOfConclusion = extractSubjects(conclusion);
    for (const subjects of subjectsOfPremises) {
        if (subjects[0]+subjects[1] === subjectsOfConclusion[0]+subjectsOfConclusion[1]
         || subjects[1]+subjects[0] === subjectsOfConclusion[0]+subjectsOfConclusion[1])
            return true;
    }
}

function extractSubjects(phrase) {
    return [...phrase.matchAll(/<span class="subject">(.*?)<\/span>/g)].map(a => a[1]);
}

class SyllogismQuestion {
    constructor() {
    }

    create(length) {
        let bucket;
        let isValid;
        let rule;
        let premises = [];
        let conclusion;
        do {
            bucket = createStimuli(length + 1);
            premises = []

            conclusion;
            isValid = coinFlip();
            let a, b;
            if (isValid) {
                rule = validRules[Math.floor(Math.random() * validRules.length)];
                [a, b, conclusion] = getSyllogism(
                    bucket[0],
                    bucket[1],
                    bucket[2],
                    rule
                );
            } else {
                rule = getRandomInvalidRule();
                [a, b, conclusion] = getSyllogism(
                    bucket[0],
                    bucket[1],
                    bucket[2],
                    getRandomInvalidRule()
                );
            }
            premises.push(a);
            premises.push(b);
        } while(isPremiseSimilarToConlusion(premises, conclusion));

        for (let i = 3; i < bucket.length; i++) {
            let rnd = Math.floor(Math.random() * (i - 1));
            let flip = coinFlip();
            let p = flip ? bucket[i] : bucket[rnd];
            let m = flip ? bucket[rnd] : bucket[i];
            premises.push(getSyllogism("#####", p, m, getRandomInvalidRule())[0]);
        }

        premises = scramble(premises);

        const countdown = this.getCountdown();
        return {
            category: 'Syllogism',
            type: "syllogism",
            startedAt: new Date().getTime(),
            rule,
            bucket,
            isValid,
            premises,
            conclusion,
            ...(countdown && { countdown }),
        };
    }

    getCountdown() {
        return savedata.overrideSyllogismTime;
    }
}

function createSyllogismGenerator(length) {
    return {
        question: new SyllogismQuestion(),
        premiseCount: getPremisesFor('overrideSyllogismPremises', length),
        weight: savedata.overrideSyllogismWeight,
    };
}



/* ---- js/generators/binary.js ---- */


function createBinaryGeneratorPool(length) {
    let generators = [];
    if (savedata.enableDistinction)
        generators.push(createDistinctionGenerator(length));
    if (savedata.enableLinear)
        generators.push(...createLinearGenerators(length));
    if (savedata.enableSyllogism)
        generators.push(createSyllogismGenerator(length));
    if (savedata.enableDirection)
        generators.push(createDirectionGenerator(length));
    if (savedata.enableDirection3D)
        generators.push(createDirection3DGenerator(length));
    if (savedata.enableDirection4D)
        generators.push(createDirection4DGenerator(length));
    return generators;
}


function getBinaryCountdown(offset=0) {
    return savedata.overrideBinaryTime ? savedata.overrideBinaryTime + offset : null;
}

class BinaryQuestion {
    create(length) {
        length = Math.max(4, length);
        const operands = [
            "a&&b",                 // and
            "!(a&&b)",              // nand
            "a||b",                 // or
            "!(a||b)",              // nor
            "!(a&&b)&&(a||b)",      // xor
            "!(!(a&&b)&&(a||b))"    // xnor
        ];

        const operandNames = [
            "AND",
            "NAND",
            "OR",
            "NOR",
            "XOR",
            "XNOR"
        ];

        const operandTemplates = [
            '$a <div class="is-connector">and</div> $b',
            '<div class="is-connector"></div> $a <div class="is-connector">nand</div> $b <div class="is-connector">are true</div>',
            '$a <div class="is-connector">or</div> $b',
            '<div class="is-connector">Neither</div> $a <div class="is-connector">nor</div> $b',
            '<div class="is-connector">Either</div> $a <div class="is-connector">or</div> $b',
            '<div class="is-connector">Both</div> $a <div class="is-connector">and</div> $b <div class="is-connector">are the same</div>'
        ];

        const pool = createBinaryGeneratorPool();
        let choice;
        let choice2;
        let premises;
        let conclusion = "";
        const flip = coinFlip();
        let isValid;
        const operandIndex = Math.floor(Math.random()*operands.length);
        const operand = operands[operandIndex];
        while (flip !== isValid) {
            let [generator, generator2] = pickRandomItems(pool, 2).picked;

            [choice, choice2] = [
                generator.question.create(Math.floor(length/2)),
                generator2.question.create(Math.ceil(length/2))
            ];
    
            premises = [...choice.premises, ...choice2.premises];
            premises = scramble(premises);
    
            conclusion = operandTemplates[operandIndex]
                .replace("$a", choice.conclusion)
                .replace("$b", choice2.conclusion);

            isValid = eval(
                operand
                    .replaceAll("a", choice.isValid)
                    .replaceAll("b", choice2.isValid)
            );
        }

        const countdown = getBinaryCountdown();
        return {
            category: `Binary: ${choice.category} ${operandNames[operandIndex]} ${choice2.category}`,
            type: "binary",
            modifiers: ['op1'],
            startedAt: new Date().getTime(),
            subresults: [choice, choice2],
            isValid,
            premises,
            conclusion,
            ...(countdown && { countdown }),
        };
    }
}

class NestedBinaryQuestion {
    create(length) {
        const humanOperands = [
            '<span class="is-connector DEPTH">(</span>Ã <span class="is-connector DEPTH">)</span> <span class="is-connector DEPTH">AND</span><br><span class="INDENT"></span><span class="is-connector DEPTH">(</span>Ã²<span class="is-connector DEPTH">)</span>',
            '<span class="is-connector DEPTH">(</span>Ã <span class="is-connector DEPTH">)</span> <span class="is-connector DEPTH">NAND</span><br><span class="INDENT"></span><span class="is-connector DEPTH">(</span>Ã²<span class="is-connector DEPTH">)</span>',
            '<span class="is-connector DEPTH">(</span>Ã <span class="is-connector DEPTH">)</span> <span class="is-connector DEPTH">OR</span><br><span class="INDENT"></span><span class="is-connector DEPTH">(</span>Ã²<span class="is-connector DEPTH">)</span>',
            '<span class="is-connector DEPTH">(</span>Ã <span class="is-connector DEPTH">)</span> <span class="is-connector DEPTH">NOR</span><br><span class="INDENT"></span><span class="is-connector DEPTH">(</span>Ã²<span class="is-connector DEPTH">)</span>',
            '<span class="is-connector DEPTH">(</span>Ã <span class="is-connector DEPTH">)</span> <span class="is-connector DEPTH">XOR</span><br><span class="INDENT"></span><span class="is-connector DEPTH">(</span>Ã²<span class="is-connector DEPTH">)</span>',
            '<span class="is-connector DEPTH">(</span>Ã <span class="is-connector DEPTH">)</span> <span class="is-connector DEPTH">XNOR</span><br><span class="INDENT"></span><span class="is-connector DEPTH">(</span>Ã²<span class="is-connector DEPTH">)</span>'
        ];

        const evalOperands =[
            "(a)&&(b)",
            "!((a)&&(b))",
            "(a)||(b)",
            "!((a)||(b))",
            "!((a)&&(b))&&((a)||(b))",
            "!(!((a)&&(b))&&((a)||(b)))"
        ];

        const pool = createBinaryGeneratorPool();

        length = Math.max(4, length);
        const halfLength = Math.floor(length / 2);
        const questions = Array(halfLength).fill(0)
            .map(() => pool[Math.floor(Math.random() * pool.length)].question.create(2));

        let numOperands = +savedata.maxNestedBinaryDepth;
        let i = 0;
        function generator(remaining, depth) {
            remaining--;
            const left = Math.floor(Math.random() * remaining);
            const right = remaining - left;
            const rndIndex = Math.floor(Math.random() * humanOperands.length);
            const humanOperand = humanOperands[rndIndex];
            const evalOperand = evalOperands[rndIndex];
            const val = (left > 0)
                ? generator(left, depth+1)
                : (i++) % halfLength;
            const val2 = (right > 0)
                ? generator(right, depth+1)
                : (i++) % halfLength;
            const letter = String.fromCharCode(97 + depth);
            return {
                human: humanOperand
                    .replaceAll('DEPTH', 'depth-' + letter)
                    .replaceAll('INDENT', 'indent-' + letter)
                    .replace('Ã ', val > - 1 ? val : val.human)
                    .replace('Ã²', val2 > - 1 ? val2 : val2.human),
                eval: evalOperand
                    .replaceAll('a', val > - 1 ? val : val.eval)
                    .replaceAll('b', val2 > - 1 ? val2 : val2.eval),
            };
        }

        const generated = generator(numOperands, 0);

        const category = Object.keys(
            questions
                .map(q => q.category)
                .reduce((a, c) => (a[c] = 1, a), {})
        )
        .join('/');
        const isValid = eval(generated.eval.replaceAll(/(\d+)/g, m => questions[m].isValid));
        const premises = questions.reduce((a, q) => [ ...a, ...q.premises ], [])
        const conclusion = generated.human.replaceAll(/(\d+)/g, m => questions[m].conclusion);
        const countdown = getBinaryCountdown();

        return {
            category: `Nested Binary: ${category}`,
            type: "binary",
            modifiers: [`op${numOperands}`],
            startedAt: new Date().getTime(),
            subresults: questions,
            isValid,
            premises,
            conclusion,
            ...(countdown && { countdown }),
        };
    }
}

function createBinaryGenerator(length) {
    return {
        question: new BinaryQuestion(),
        premiseCount: getPremisesFor('overrideBinaryPremises', length),
        weight: 100,
    };
}

function createNestedBinaryGenerator(length) {
    return {
        question: new NestedBinaryQuestion(),
        premiseCount: getPremisesFor('overrideBinaryPremises', length),
        weight: 100,
    };
}



/* ---- js/generators/analogy.js ---- */


function pickAnalogyStatementSameTwoOptions() {
    return pickNegatable([
        '<div class="analogy-statement">is the same as</div>',
        '<div class="analogy-statement" style="color: red;">is different from</div>'
    ]);
}

function pickAnalogyStatementDifferentTwoOptions() {
    return pickNegatable([
        '<div class="analogy-statement">is different from</div>',
        '<div class="analogy-statement" style="color: red;">is the same as</div>'
    ]);
}

function pickAnalogyStatementSame() {
    return pickNegatable([
        '<div class="analogy-statement">has the same relation as</div>',
        '<div class="analogy-statement" style="color: red">has a different relation from</div>',
    ]);
}

function pickAnalogyStatementDifferent() {
    return pickNegatable([
        '<div class="analogy-statement">has a different relation from</div>',
        '<div class="analogy-statement" style="color: red">has the same relation as</div>',
    ]);
}

function analogyTo(a, b) {
    return `<span class="subject">${a}</span> to <span class="subject">${b}</span>`;
}

class AnalogyQuestion {
     create(length) {
        const timeOffset = savedata.offsetAnalogyTime;
        const premiseOffset = getPremisesFor('offsetAnalogyPremises', 0);
        const choiceIndices = [];

        let generators = [];
        if (savedata.enableDistinction)
            generators.push(createDistinctionGenerator(length));
        if (savedata.enableLinear)
            generators.push(...createLinearGenerators(length));
        if (savedata.enableDirection)
            generators.push(createDirectionGenerator(length));
        if (savedata.enableDirection3D)
            generators.push(createDirection3DGenerator(length));
        if (savedata.enableDirection4D)
            generators.push(createDirection4DGenerator(length));
        if (savedata.enableAnchorSpace)
            generators.push(createAnchorSpaceGenerator(length));

        const totalWeight = generators.reduce((sum, item) => sum + item.weight, 0);
        const randomValue = Math.random() * totalWeight;
        let cumulativeWeight = 0;
        let g;
        for (let generator of generators) {
            cumulativeWeight += generator.weight;
            if (randomValue < cumulativeWeight) {
                g = generator;
                break;
            }
        }

        let question = g.question.createAnalogy(Math.max(g.premiseCount + premiseOffset, 3));
        question.plen = g.premiseCount;
        question.tlen = question.countdown || savedata.timer;
        question.tags = ['analogy'];
        if (question.countdown) {
            question.countdown += timeOffset;
        } else {
            question.timeOffset = timeOffset;
        }

        return question;
    }
}

function createAnalogyGenerator(length) {
    return {
        question: new AnalogyQuestion(),
        premiseCount: length,
        weight: 100,
    };
}



/* ---- js/generators/banned.js ---- */


const bannedWords = ['DIC', 'DIK', 'COC', 'COK', 'FUC', 'FUK', 'FEC', 'FEK', 'NIG', 'PIS', 'TIT', 'SEX', 'GAY', 'FAG'];



/* ---- js/generators/stimuli.js ---- */


function createNonsenseWord() {
    const vowels = ['A', 'E', 'I', 'O', 'U'], consonants = ['B', 'C', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'V', 'W', 'X', 'Y', 'Z'];
    let string = '';
    for (; string.length < savedata.nonsenseWordLength;) {
        if ((string.length + 1) % 2) 
            string += consonants[Math.floor(Math.random() * 21)];
        else 
            string += vowels[Math.floor(Math.random() * 5)];

        if (string.length == savedata.nonsenseWordLength) {
            if (bannedWords.some(d => string.includes(d))) {
                string = '';
            } else {
                return string;
            }
        }
    }
}

function createGarbageWord() {
    const consonants = ['B', 'C', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'V', 'W', 'X', 'Z'];
    let string = '';
    while (string.length < savedata.garbageWordLength) {
        const c = consonants[Math.floor(Math.random() * consonants.length)]
        if (string.length > 0 && string.endsWith(c)) {
            continue;
        }
        string += c;
    }
    return string;
}

let currentJunkEmojiSequence = [0, 3, 6, 9, 1, 4, 7, 2, 5, 8];
let currentJunkEmojiSequenceId = 0;
function createJunkEmoji() {
    const splitSize = Math.floor(JUNK_EMOJI_COUNT / currentJunkEmojiSequence.length);
    const numSplits = JUNK_EMOJI_COUNT / splitSize;
    let offset = currentJunkEmojiSequence[currentJunkEmojiSequenceId] * splitSize;
    const choice = Math.floor(Math.random() * JUNK_EMOJI_COUNT / numSplits);
    const id = offset + choice;
    currentJunkEmojiSequenceId++;
    if (currentJunkEmojiSequenceId >= currentJunkEmojiSequence.length) {
        currentJunkEmojiSequenceId = 0;
    }
    return `[junk]${id}[/junk]`;
}

function createVisualNoiseTag() {
    const id = Math.floor(Math.random() * 999999);
    const splits = savedata.visualNoiseSplits;
    return `[vnoise]${id},${splits}[/vnoise]`;
}

function maxStimuliAllowed() {
    const stimuliConfigs = createStimuliConfigs();
    return stimuliConfigs.reduce((a, b) => Math.min(a, b.limit), 999) - 1;
}

function createStimuliConfigs() {
    const stimuliConfigs = [];
    if (savedata.useMeaningfulWords && savedata.meaningfulWordNouns) {
        stimuliConfigs.push({
            limit: meaningfulWords.nouns.length,
            generate: () => pickRandomItems(meaningfulWords.nouns, 1).picked[0],
        });
    };
    if (savedata.useMeaningfulWords && savedata.meaningfulWordAdjectives) {
        stimuliConfigs.push({
            limit: meaningfulWords.adjectives.length,
            generate: () => pickRandomItems(meaningfulWords.adjectives, 1).picked[0],
        });
    };
    if (savedata.useEmoji) {
        stimuliConfigs.push({
            limit: emoji.length,
            generate: () => pickRandomItems(emoji, 1).picked[0],
        });
    };
    if (savedata.useJunkEmoji) {
        stimuliConfigs.push({
            limit: JUNK_EMOJI_COUNT,
            generate: () => createJunkEmoji(),
        });
    };
    if (savedata.useVisualNoise) {
        stimuliConfigs.push({
            limit: 1000,
            generate: () => createVisualNoiseTag(),
        });
    };
    if (savedata.useGarbageWords) {
        stimuliConfigs.push({
            limit: 19 ** (savedata.garbageWordLength),
            generate: createGarbageWord,
        });
    };
    if (savedata.useNonsenseWords || stimuliConfigs.length === 0) {
        let limit;
        if (savedata.nonsenseWordLength % 2)
            limit = (20 ** (Math.floor(savedata.nonsenseWordLength / 2) + 1)) * (5 ** Math.floor(savedata.nonsenseWordLength / 2));
        else 
            limit = (20 ** (savedata.nonsenseWordLength / 2)) * (5 ** (savedata.nonsenseWordLength / 2));
        stimuliConfigs.push({
            limit: limit,
            generate: () => createNonsenseWord(),
        });
    };

    stimuliConfigs.forEach(config => config.unique = new Set());
    return stimuliConfigs;
}

function createStimuli(numberOfStimuli, usedStimuli) {
    let stimuliConfigs = createStimuliConfigs();
    shuffle(stimuliConfigs);
    let configIndex = 0;
    const nextConfig = () => {
        const config = stimuliConfigs[configIndex];
        configIndex++;
        if (configIndex >= stimuliConfigs.length) {
            configIndex = 0;
        }
        return config;
    }

    const stimuliCreated = [];
    for (let i = 0; i < numberOfStimuli; i++) {
        let config = nextConfig();
        for (let j = 0; j < 9999 && config.unique.length >= config.limit; j++)
            config = nextConfig();
        let nextStimuli = config.generate();
        for (let j = 0; j < 9999 && config.unique.has(nextStimuli); j++) {
            nextStimuli = config.generate();
        }
        stimuliCreated.push(nextStimuli);
        config.unique.add(nextStimuli);
    }

    shuffle(stimuliCreated);
    return stimuliCreated
}



/* ---- js/generators/premise-html.js ---- */


function createPremiseHTML(premise, allowReversal=true) {
    if (typeof premise === 'string') {
        return premise;
    }
    if (savedata.widePremises && Array.isArray(premise)) {
        return createWidePremiseHTML(premise, allowReversal);
    } else {
        return createBasicPremiseHTML(premise, allowReversal);
    }
}

function createBasicPremiseHTML(premise, allowReversal=true) {
    const relation = savedata.minimalMode ? premise.relationMinimal : premise.relation;
    const reverse = savedata.minimalMode ? premise.reverseMinimal : premise.reverse;
    let ps;
    if (!allowReversal || coinFlip()) {
      ps = [
      `<span class="subject">${premise.start}</span> <span class="relation">${relation}</span> <span class="subject">${premise.end}</span>`,
      `<span class="subject">${premise.start}</span> <span class="relation"><span class="is-negated">${reverse}</span></span> <span class="subject">${premise.end}</span>`,
      ];
    } else {
      ps = [
      `<span class="subject">${premise.end}</span> <span class="relation">${reverse}</span> <span class="subject">${premise.start}</span>`,
      `<span class="subject">${premise.end}</span> <span class="relation"><span class="is-negated">${relation}</span></span> <span class="subject">${premise.start}</span>`,
      ];
    }
    return pickNegatable(ps);
}

function createWidePremiseHTML(premise, allowReversal=true) {
    if (premise.length === 1) {
        return createBasicPremiseHTML(premise[0], allowReversal);
    }

    let [left, right] = premise;
    if (right.end === left.start) {
        [left, right] = [right, left];
    }
    const leftRelation = savedata.minimalMode ? left.relationMinimal : left.relation;
    const leftReverse = savedata.minimalMode ? left.reverseMinimal : left.reverse;
    const rightRelation = savedata.minimalMode ? right.relationMinimal : right.relation;
    const rightReverse = savedata.minimalMode ? right.reverseMinimal : right.reverse;
    let a, b, c, ab, bc, abRev, bcRev;
    if (left.end === right.start) {
        a = left.start;
        b = left.end;
        c = right.end;
        ab = leftRelation;
        abRev = leftReverse;
        bc = rightRelation;
        bcRev = rightReverse;
    } else if (left.start === right.start) {
        a = left.end;
        b = left.start;
        c = right.end;
        ab = allowReversal ? leftReverse : leftRelation;
        abRev = allowReversal ? leftRelation : leftReverse;
        bc = rightRelation;
        bcRev = rightReverse;
    } else {
        a = left.start;
        b = left.end;
        c = right.start;
        ab = leftRelation;
        abRev = leftReverse;
        bc = allowReversal ? rightReverse : rightRelation;
        bcRev = allowReversal ? rightRelation : rightReverse;
    }

    if (savedata.enableNegation && coinFlip()) {
        ab, abRev = `<span class="is-negated">${abRev}</span>`, `<span class="is-negated">${ab}</span>`;
    }
    if (savedata.enableNegation && coinFlip()) {
        bc, bcRev = `<span class="is-negated">${bcRev}</span>`, `<span class="is-negated">${bc}</span>`;
    }

    if (!allowReversal || coinFlip()) {
        return `<span class="subject">${a}</span> <span class="relation">${ab}</span> <span class="subject">${b}</span> <span class="relation">${bc}</span> <span class="subject">${c}</span>`;
    } else {
        return `<span class="subject">${c}</span> <span class="relation">${bcRev}</span> <span class="subject">${b}</span> <span class="relation">${abRev}</span> <span class="subject">${a}</span>`;
    }
}



/* ---- js/generators/wide-premises.js ---- */


function createWidePremises(premises, premiseMap) {
    if (!premiseMap) {
        premiseMap = {};
        for (const premise of premises) {
            premiseMap[premiseKey(premise.start, premise.end)] = premise;
        }
    }

    const graph = new Map();
    const edges = new Set();

    for (const { start, end } of premises) {
        if (!graph.has(start)) graph.set(start, []);
        if (!graph.has(end)) graph.set(end, []);
        graph.get(start).push(end);
        graph.get(end).push(start);
        edges.add(premiseKey(start, end));
    }

    if (premises.length > 20) {
        return createWidePremisesNonOptimal(premises, premiseMap, graph, edges);
    }

    const triplets = [];
    for (const [b, neighbors] of graph.entries()) {
        if (neighbors.length < 2) continue;
        for (let i = 0; i < neighbors.length; i++) {
            for (let j = i + 1; j < neighbors.length; j++) {
                const a = neighbors[i];
                const c = neighbors[j];
                const ab = premiseKey(a, b);
                const bc = premiseKey(b, c);
                triplets.push({ edges: [ab, bc], nodes: [a, b, c] });
            }
        }
    }

    let best = { used: new Set(), tripletIndices: [] };

    function backtrack(index = 0, used = new Set(), chosen = []) {
        if (index >= triplets.length) {
            if (used.size > best.used.size) {
                best = { used: new Set(used), tripletIndices: [...chosen] };
            }
            return;
        }

        const triplet = triplets[index];
        const [ab, bc] = triplet.edges;

        backtrack(index + 1, used, chosen);

        if (!used.has(ab) && !used.has(bc)) {
            used.add(ab);
            used.add(bc);
            chosen.push(index);
            backtrack(index + 1, used, chosen);
            used.delete(ab);
            used.delete(bc);
            chosen.pop();
        }
    }

    backtrack();

    const result = [];
    const usedEdges = best.used;
    for (const index of best.tripletIndices) {
        const { edges } = triplets[index];
        result.push([premiseMap[edges[0]], premiseMap[edges[1]]]);
    }

    const leftover = [...edges].filter(e => !usedEdges.has(e));
    for (const key of leftover) {
        result.push([premiseMap[key]]);
    }

    return result;
}

function createWidePremisesNonOptimal(premises, premiseMap, graph, edges) {
    const usedEdges = new Set();
    const result = [];

    for (const [b, neighbors] of graph.entries()) {
        const available = neighbors.filter(n => {
            const k = premiseKey(b, n);
            return !usedEdges.has(k);
        });

        while (available.length >= 2) {
            const a = available.pop();
            const c = available.pop();
            const ab = premiseKey(a, b);
            const bc = premiseKey(b, c);
            usedEdges.add(ab);
            usedEdges.add(bc);
            result.push([premiseMap[ab], premiseMap[bc]]);
        }
    }

    for (const edge of edges) {
        if (!usedEdges.has(edge)) {
            result.push([premiseMap[edge]]);
        }
    }

    return result;
}



/* ---- js/generators/premise-reorder.js ---- */


function premiseKey(source, target) {
    return JSON.stringify([source, target].sort());
}

// Util to take a branching (non-linear) graph of premises, and reorder them so
// they mostly appear in connection order.
function orderPremises(premiseMap, neighbors) {
    let premises = [];
    let traversed = new Set();
    const traverse = (word, parent) => {
        if (traversed.has(word)) {
            return;
        }
        traversed.add(word);

        const key = premiseKey(word, parent);
        if (premiseMap[key]) {
            premises.push(premiseMap[key]);
        }
        const traversalOptions = [...neighbors[word]];
        traversalOptions.sort((a,b) => neighbors[a].length - neighbors[b].length);
        for (const neighbor of traversalOptions) {
            traverse(neighbor, word);
        }
    }
    const start = Object.keys(neighbors).filter(word => neighbors[word].length === 1)[0];
    traverse(start, null);

    return premises;
}

function scramble(premises) {
    const divisions = premises.length - 1;
    const unbreakableDivisions = Math.floor((100 - savedata.scrambleFactor) * divisions / 100);
    return scrambleWithLimit(premises, unbreakableDivisions);
}

function scrambleWithLimit(premises, unbreakableDivisions) {
    const indices = Array.from({ length: premises.length - 1 }, (_, i) => i + 1);
    const selected = pickRandomItems(indices, unbreakableDivisions).picked;

    let groups = []
    for (let i = 0; i < premises.length; i++) {
        if (!groups || !selected.includes(i)) {
            groups.push([i]);
        } else {
            groups[groups.length - 1].push(i);
        }
    }

    let endIndices;
    let attempts;
    let neighborCount;
    for (attempts = 0; attempts < 100; attempts++) {
        endIndices = shuffle(groups.slice()).flat();
        neighborCount = 0;
        for (let i = 0; i < endIndices.length - 1; i++) {
            if (Math.abs(endIndices[i] - endIndices[i+1]) === 1) {
                neighborCount += 1;
            }
        }
        const chanceOfLargeLeeway = premises.length <= 5 ? 0.7 : 0.3
        let leeway = Math.random() < chanceOfLargeLeeway ? 2 : 1;
        if (savedata.scrambleFactor >= 95) {
            leeway = 1;
        }
        if (Math.abs(unbreakableDivisions - neighborCount) <= leeway) {
            break;
        }
    }

    const scrambledPremises = endIndices.map(i => premises[i]);
    if (savedata.widePremises) {
        const thinPremiseIndex = scrambledPremises.findIndex(p => Array.isArray(p) && p.length == 1);
        if (thinPremiseIndex !== -1) {
            const thinPremise = scrambledPremises[thinPremiseIndex];
            scrambledPremises.splice(thinPremiseIndex, 1);
            scrambledPremises.push(thinPremise);
        }
    }
    return scrambledPremises;
}



/* ---- js/explanation.js ---- */


function createGridFromMap(wordCoordMap) {
    const entries = Object.entries(wordCoordMap);
    const low = structuredClone(entries[0][1]);
    const high = structuredClone(entries[0][1]);

    for (const [word, coord] of entries) {
        for (const i in coord) {
            low[i] = Math.min(low[i], coord[i])
            high[i] = Math.max(high[i], coord[i])
        }
    }

    const dimensions = low.map((l, i) => high[i] - l + 1);
    const createNArray = (i) => {
        if (i < 0)
            return '';
        return Array.from({ length: dimensions[i] }, (_, a) => createNArray(i-1));
    };
    const grid = createNArray(dimensions.length - 1);

    for (const [word, coord] of entries) {
        let curr = grid
        for (let i = coord.length - 1; i >= 0; i--) {
            const loc = coord[i] - low[i];
            if (!Array.isArray(curr[loc])) {
                curr[loc] += (curr[loc].length > 0 ? ',' : '') + word;
                break;
            }
            curr = curr[loc]
        }
    }

    return grid;
}

function centerText(text, width) {
    if (text.length > 50) {
        const half = Math.floor(width / 2);
        const padding = ' '.repeat(half);
        return padding + text + padding;
    }
    const totalPadding = width - text.length;
    const paddingStart = Math.floor(totalPadding / 2);
    return text.padStart(text.length + paddingStart).padEnd(width);
}

function createFiller(grid) {
    const lengths = grid.flat(Infinity).map(x => x.length > 50 ? 1 : x.length);
    const biggest = lengths.reduce((a, b) => Math.max(a, b));
    const neededLength = biggest + 2;
    return '\u00A0'.repeat(neededLength);
}

function fillTable(grid, filler) {
    let s = '';
    for (let i = grid.length - 1; i >= 0; i--) {
        const row = grid[i];
        for (const val of row) {
            s += '<div class="td">' + (val ? centerText(val, filler.length) : filler) + '</div>';
        }
    }
    return s;
}

function createExplanation2D(grid, filler, separatorFn) {
    if (!filler) {
        filler = createFiller(grid);
    }

    if (!separatorFn) {
        separatorFn = (s) => `<div class="table" style="grid-template-columns: repeat(${grid[0].length}, auto)">${s}</div>`;
    }

    return separatorFn(fillTable(grid, filler));
}

function createExplanation3D(grid, filler) {
    if (!filler) {
        filler = createFiller(grid);
    }
    const gridWidth = grid[0][0].length;
    let s = `<div class="three-d-scene">`
    for (let i = grid.length - 1; i >= 0; i--) {
        s += createExplanation2D(grid[i], filler, (s) => {
            return `<div class="table three-d-plane plane-${grid.length - i}" style="grid-template-columns: repeat(${gridWidth}, minmax(min-content, 1fr))">${s}</div>`
        });
    }
    s += '</div>'
    s += `<style>.three-d-plane .td { max-width: ${Math.floor((100 / gridWidth) - 4)}vw; }</style>`
    return s;
}

function createExplanation4D(grid) {
    const filler = createFiller(grid);
    let s = '<div class="four-d-scene" style="display: flex; gap: 0.5rem;">';
    for (let i = 0; i < grid.length; i++) {
        let time = i + 1;
        s += '<div>';
        s += '<div>Time ' + time + '</div>'
        s += createExplanation3D(grid[i], filler);
        s += '</div>';
    }
    s += '</div>'
    return s;
}

function createExplanationBucket(question) {
    if (question.category === 'Vertical') {
        return question.bucket.map(word => `<div>${word}</div>`).join('');
    } else if (question.category === 'Comparison') {
        return question.bucket.join(' < ');
    } else {
        return question.bucket.join(" ");
    }
}

function createExplanationBuckets(question) {
    if (question.category === 'Vertical') {
        return question.buckets
            .map(bucket => '<div style="justify-self: start;">' + bucket.join(' ') + '</div>')
            .join('<div class="divider"></div>');
    }
    const filler = createFiller(question.buckets);
    const verticalLength = question.buckets.reduce((a, b) => Math.max(a, b));
    let s = '<table class="distinction">';
    s += '<tr>';
    for (const bucket of question.buckets) {
        
        s += '<td>';
        for (const item of bucket) {
            s += '<div>' + centerText(item, filler.length) + '</div>';
        }
        s += '</td>';
    }
    s += '</tr>';
    s += '</table>';
    return s;
}

function createExplanation(question) {
    if (question.bucket) {
        return createExplanationBucket(question);
    }

    if (question.buckets) {
        return createExplanationBuckets(question);
    }

    if (question.wordCoordMap) {
        const grid = createGridFromMap(question.wordCoordMap);
        if (grid && Array.isArray(grid[0]) && Array.isArray(grid[0][0]) && Array.isArray(grid[0][0][0])) {
            return createExplanation4D(grid);
        } else if (grid && Array.isArray(grid[0]) && Array.isArray(grid[0][0])) {
            return createExplanation3D(grid);
        } else {
            return createExplanation2D(grid);
        }
    }

    if (question.subresults) {
        return question.subresults.map(createExplanation).join('<div class="binary-explainer-separator"></div>');
    }
}

function createExplanationPopup(question, e) {
    const popup = document.createElement("div");
    popup.className = "explanation-popup";
    popup.style.position = "fixed";
    popup.style.top = "50%";
    popup.style.left = "50%";
    popup.style.transform = "translate(-50%, -50%)";
    popup.style.zIndex = "1000";
    popup.style.padding = "20px";
    popup.style.backgroundColor = "var(--background-color)";
    popup.style.borderRadius = "8px";
    popup.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
    popup.style.width = "fit-content";
    popup.style.maxWidth = "98vw";
    popup.style.maxHeight = "98vh";
    popup.style.overflow = "hidden";
    popup.style.textAlign = "center";
    popup.style.pointerEvents = "none";

    const content = document.createElement("pre");
    content.innerHTML = createExplanation(question);
    popup.appendChild(content);

    document.body.appendChild(popup);
}

function removeExplanationPopup() {
    for (let i = 0; i < 5; i++) {
        let elems = document.getElementsByClassName("explanation-popup");
        if (elems.length === 0) {
            break;
        }
        for (const el of elems) {
            el.remove();
        }
    }
}

function createExplanationButton(question) {
    if (question.category === 'Syllogism') {
        return '';
    }

    if (question.wordCoordMap || question.bucket || question.buckets || question.subresults) {
        return `<button class="explanation-button">Explanation</button>`;
    }

    return ''
}




/* ---- js/backwards-compatibility.js ---- */


class SettingsMigration {
    update(settings) {
        if (settings.version === 1) {
            this.upgradeToV2(settings);
        }

        if (settings.version === 2) {
            this.upgradeToV3(settings);
        }

        for (const key of Object.keys(defaultSavedata)) {
            if (!settings.hasOwnProperty(key)) {
                settings[key] = defaultSavedata[key];
            }
        }
    }

    // Do not remove. Old share links still use V1, so getting rid of this will break those links
    upgradeToV2(settings) {
        if (settings.hasOwnProperty('enableComparison') || settings.hasOwnProperty('enableTemporal')) {
            settings.enableLinear = settings.enableComparison || settings.enableTemporal;
            let wording = [];
            if (settings.enableComparison) {
                wording.push('comparison');
            }
            if (settings.enableTemporal) {
                wording.push('temporal');
            }
            if (wording.length === 0) {
                wording.push('leftright');
            }
            settings.linearWording = wording.join(',');
            delete settings.enableComparison;
            delete settings.enableTemporal;
        }

        if (settings.hasOwnProperty('overrideComparisonPremises') || settings.hasOwnProperty('overrideTemporalPremises')) {
            settings.overrideLinearPremises = settings.overrideComparisonPremises ?? settings.overrideTemporalPremises;
            delete settings.overrideComparisonPremises;
            delete settings.overrideTemporalPremises;
        }

        if (settings.hasOwnProperty('overrideComparisonTime') || settings.hasOwnProperty('overrideTemporalTime')) {
            settings.overrideLinearTime = settings.overrideComparisonTime ?? settings.overrideTemporalTime;
            delete settings.overrideComparisonTime;
            delete settings.overrideTemporalTime;
        }

        if (settings.hasOwnProperty('enableBacktrackingComparison') || settings.hasOwnProperty('enableBacktrackingTemporal')) {
            settings.enableBacktrackingLinear = settings.enableBacktrackingComparison ?? settings.enableBacktrackingTemporal;
            delete settings.enableBacktrackingComparison;
            delete settings.enableBacktrackingTemporal;
        }
        settings.version = 2;
    }

    upgradeToV3(settings) {
        if (settings.hasOwnProperty('scrambleLimit')) {
            const limit = settings.scrambleLimit;
            if (limit === null || limit === undefined) {
                settings.scrambleFactor = 80;
            } else if (limit === 0) {
                settings.scrambleFactor = 0;
            } else if (limit === 1) {
                settings.scrambleFactor = 35;
            } else if (limit === 2) {
                settings.scrambleFactor = 65;
            } else {
                settings.scrambleFactor = 80;
            }
            delete settings.scrambleLimit;
        }
        settings.version = 3;
    }

    updateRRTHistory(progressStore) {
        const cursorRequest = progressStore.openCursor();
        cursorRequest.onsuccess = (event) => {
            const cursor = event.target.result;
            if (cursor) {
                const entry = cursor.value;

                if (entry.type === 'comparison') {
                    entry.type = 'linear';
                    entry.key = entry.key.replace('comparison', 'linear');
                    cursor.update(entry);
                }

                if (entry.type === 'temporal') {
                    entry.type = 'linear';
                    entry.key = entry.key.replace('temporal', 'linear');
                    cursor.update(entry);
                }
                cursor.continue();
            }
        };

        cursorRequest.onerror = (event) => {
            console.error('Error iterating through RRTHistory:', event.target.error);
        };
    }
}



/* ---- js/db.js ---- */


const openDatabase = () => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('SyllDB', 5);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains('ImageStore')) {
                db.createObjectStore('ImageStore', { keyPath: 'id' });
            }

            if (!db.objectStoreNames.contains('RRTHistory')) {
                const progressStore = db.createObjectStore('RRTHistory', { keyPath: 'id', autoIncrement: true });
                progressStore.createIndex('orderIndex', ['key', 'timestamp'], { unique: false });
            }

            const progressStore = event.target.transaction.objectStore('RRTHistory');
            if (!progressStore.indexNames.contains('timestampIndex')) {
                progressStore.createIndex('timestampIndex', 'timestamp', { unique: false });
            }

            new SettingsMigration().updateRRTHistory(progressStore);
        };

        request.onsuccess = (event) => resolve(event.target.result);
        request.onerror = (event) => reject(event.target.error);
    });
};

const initDB = async () => {
    return await openDatabase();
};

const storeImageLocal = async (id, image) => {
    const db = await initDB();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction('ImageStore', 'readwrite');
        const store = transaction.objectStore('ImageStore');

        const request = store.put({ id, value: image });

        request.onsuccess = () => resolve('Image stored successfully!');
        request.onerror = (event) => reject(event.target.error);
    });
};

const getImageLocal = async (id) => {
    const db = await initDB();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction('ImageStore', 'readonly');
        const store = transaction.objectStore('ImageStore');

        const request = store.get(id);

        request.onsuccess = (event) => resolve(event.target.result?.value);
        request.onerror = (event) => reject(event.target.error);
    });
};

const deleteImageLocal = async (id) => {
    const db = await initDB();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction('ImageStore', 'readwrite');
        const store = transaction.objectStore('ImageStore');

        const request = store.delete(id);

        request.onsuccess = (event) => resolve('Image deleted successfully');
        request.onerror = (event) => reject(event.target.error);
    });
};

const storeProgressDataLocal = async (progressData) => {
    const db = await initDB();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction('RRTHistory', 'readwrite');
        const store = transaction.objectStore('RRTHistory');

        const request = store.add(progressData);

        request.onsuccess = () => resolve('RRTHistory stored successfully!');
        request.onerror = (event) => reject(event.target.error);
    });
};

const storeImage = async (id, image) => {
    if (isSupabaseConfigured()) {
        // Best-effort cloud sync; keep local write as source-of-truth for current session.
        try { void storeImageCloud(id, image); } catch (e) {}
    }
    return await storeImageLocal(id, image);
};

const getImage = async (id) => {
    if (isSupabaseConfigured()) {
        try {
            const remote = await getImageCloud(id);
            if (remote) {
                try { await storeImageLocal(id, remote); } catch (e) {}
                return remote;
            }
        } catch (e) {}
    }
    return await getImageLocal(id);
};

const deleteImage = async (id) => {
    if (isSupabaseConfigured()) {
        try { void deleteImageCloud(id); } catch (e) {}
    }
    return await deleteImageLocal(id);
};

const storeProgressData = async (progressData) => {
    if (isSupabaseConfigured()) {
        try {
            const ok = await storeProgressCloud(progressData);
            if (ok) {
                // Cloud is the source of truth for graph history.
                try { void maybeUpdateLeaderboards(progressData); } catch (e) {}
                return 'RRTHistory stored successfully!';
            }
        } catch (e) {}
    }
    return await storeProgressDataLocal(progressData);
};

const getTopRRTProgressLocal = async (keys, count = 20) => {
    const db = await initDB();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction('RRTHistory', 'readonly');
        const store = transaction.objectStore('RRTHistory');
        const index = store.index('orderIndex');

        let results = [];
        let pendingKeys = keys.length;
        let maxResults = count * keys.length;

        keys.forEach(key => {
            const keyRange = IDBKeyRange.bound([key, 0], [key, Infinity]);
            const request = index.openCursor(keyRange, 'prev');

            request.onsuccess = (event) => {
                const cursor = event.target.result;
                if (cursor) {
                    results.push(cursor.value);

                    if (results.length >= maxResults) {
                        pendingKeys = 0;
                        finalizeResults();
                        return;
                    }

                    cursor.continue();
                } else {
                    pendingKeys--;
                    if (pendingKeys === 0) finalizeResults();
                }
            };

            request.onerror = (event) => reject(event.target.error);
        });

        function finalizeResults() {
            results.sort((a, b) => b.timestamp - a.timestamp);

            let filteredResults = [];
            for (const result of results) {
                if (filteredResults.length >= count || result.didTriggerProgress === true) {
                    break;
                }
                filteredResults.push(result);
            }
            resolve(filteredResults);
        }
    });
};

const getTopRRTProgress = async (keys, count = 20) => {
    if (isSupabaseConfigured()) {
        try {
            const remote = await getTopProgressCloud(keys, count);
            if (remote && remote.length >= 0) return remote;
        } catch (e) {}
    }
    return await getTopRRTProgressLocal(keys, count);
};

const getAllRRTProgressLocal = async () => {
    const db = await initDB();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction('RRTHistory', 'readonly');
        const store = transaction.objectStore('RRTHistory');
        const getAll = store.getAll();
        getAll.onsuccess = () => resolve(getAll.result);
        getAll.onerror = () => reject(getAll.error);
    });
}

const getAllRRTProgress = async () => {
    if (isSupabaseConfigured()) {
        try {
            const remote = await getAllProgressCloud();
            if (remote && remote.length >= 0) return remote;
        } catch (e) {}
    }
    return await getAllRRTProgressLocal();
}

const getTodayRRTProgress = async () => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 4, 0, 0);
    if (now.getHours() < 4) {
        todayStart.setDate(todayStart.getDate() - 1);
    }

    return await getRRTProgressFrom(todayStart.getTime());
};

const getWeekRRTProgress = async () => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() + mondayOffset, 4, 0, 0);
    if (now.getDay() === 1 && now.getHours() < 4) {
        weekStart.setDate(weekStart.getDate() - 7);
    }

    return getRRTProgressFrom(weekStart.getTime());
};

const getRRTProgressFromLocal = async (startTime) => {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction('RRTHistory', 'readonly');
        const store = transaction.objectStore('RRTHistory');
        const index = store.index('timestampIndex');
        const keyRange = IDBKeyRange.lowerBound(startTime);

        const results = [];
        const request = index.openCursor(keyRange, 'next');

        request.onsuccess = (event) => {
            const cursor = event.target.result;
            if (cursor) {
                results.push(cursor.value);
                cursor.continue();
            } else {
                resolve(results);
            }
        };
        request.onerror = (event) => reject(event.target.error);
    });
}

const getRRTProgressFrom = async (startTime) => {
    if (isSupabaseConfigured()) {
        try {
            const remote = await getProgressFromCloud(startTime);
            if (remote && remote.length >= 0) return remote;
        } catch (e) {}
    }
    return await getRRTProgressFromLocal(startTime);
}



/* ---- js/rename-db.js ---- */


function deleteDatabase(dbName) {
    return new Promise((resolve, reject) => {
        const request = indexedDB.deleteDatabase(dbName);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}


/* ---- js/progress-dropdown.js ---- */


const progressionSettingsButton = document.getElementById('progression-settings-button');
const progressionDropdown = document.getElementById('progression-dropdown');

progressionSettingsButton.addEventListener('click', (event) => {
  event.preventDefault();
  progressionDropdown.style.display = progressionDropdown.style.display === 'flex' ? 'none' : 'flex';
});

document.addEventListener('click', (event) => {
  if (!progressionDropdown.contains(event.target) && !progressionSettingsButton.contains(event.target)) {
    progressionDropdown.style.display = 'none';
  }
});



/* ---- js/linear-dropdown.js ---- */


const linearSettingsButton = document.getElementById('linear-settings-button');
const linearDropdown = document.getElementById('linear-dropdown');
const linearLeftRightCheckbox = document.getElementById('p-leftright');
const linearTopUnderCheckbox = document.getElementById('p-topunder');
const linearComparisonCheckbox = document.getElementById('p-comparison');
const linearTemporalCheckbox = document.getElementById('p-temporal');
const linearContainsCheckbox = document.getElementById('p-contains');

linearSettingsButton.addEventListener('click', (event) => {
  event.preventDefault();
  linearDropdown.style.display = linearDropdown.style.display === 'flex' ? 'none' : 'flex';
});

document.addEventListener('click', (event) => {
  if (!linearDropdown.contains(event.target) && !linearSettingsButton.contains(event.target)) {
    linearDropdown.style.display = 'none';
  }
});

function populateLinearDropdown() {
  const wording = savedata.linearWording;
  let options = wording.split(',');
  linearLeftRightCheckbox.checked = options.includes('leftright');
  linearTopUnderCheckbox.checked = options.includes('topunder');
  linearComparisonCheckbox.checked = options.includes('comparison');
  linearTemporalCheckbox.checked = options.includes('temporal');
  linearContainsCheckbox.checked = options.includes('contains');
}

function updateLinearWording(option, isSelected) {
  let options = savedata.linearWording.split(',').filter(x => x && x.length > 0);
  if (isSelected && !options.includes(option)) {
    options.push(option);
  } else if (!isSelected) {
    options = options.filter(o => o !== option);
  }

  savedata.linearWording = options.join(',');
  refresh();
}

linearLeftRightCheckbox.addEventListener('click', e => updateLinearWording('leftright', e.target.checked));
linearTopUnderCheckbox.addEventListener('click', e => updateLinearWording('topunder', e.target.checked));
linearComparisonCheckbox.addEventListener('click', e => updateLinearWording('comparison', e.target.checked));
linearTemporalCheckbox.addEventListener('click', e => updateLinearWording('temporal', e.target.checked));
linearContainsCheckbox.addEventListener('click', e => updateLinearWording('contains', e.target.checked));



/* ---- js/profile.js ---- */


const profileInput = document.getElementById('profile-input');
const profileArrow = document.getElementById('profile-arrow');
const profileList = document.getElementById('profile-list');
const profileDropdown = document.querySelector('.profile-dropdown');
const profilePlus = document.getElementById('profile-plus');
const profileShare = document.getElementById('profile-share');
const profileCopied = document.getElementById('profile-copied');

class ProfileStore {
    constructor() {
        this.profiles = [];
        this.selectedProfile = 0;
        this.settingsMigration = new SettingsMigration();
    }

    startup() {
        this.loadProfiles();
        this.loadUrl();
    }

    overrideExistingKeys(target, source) {
        for (const key of Object.keys(target)) {
            if (source.hasOwnProperty(key)) {
                target[key] = source[key];
            }
        }
    }

    loadProfiles() {
        const oldMigratedSettings = getLocalStorageObj(oldSettingsKey);

        const storedProfiles = getLocalStorageObj(profilesKey);
        if (storedProfiles && Array.isArray(storedProfiles) && storedProfiles.length > 0) {
            this.profiles = storedProfiles;
        } else {
            let starterSettings = structuredClone(defaultSavedata);
            if (oldMigratedSettings) {
                this.overrideExistingKeys(starterSettings, oldMigratedSettings);
                // Backwards compatibility: don't blow away everyone's history
                for (const movedKey of ["score", "questions", "backgroundImage", "gameAreaColor"]) {
                    if (oldMigratedSettings.hasOwnProperty(movedKey)) {
                        appState[movedKey] = oldMigratedSettings[movedKey];
                    }
                }
            }
            let defaultProfiles = [{
                name: "Default",
                id: '12345678',
                savedata: starterSettings,
            }];
            this.profiles = defaultProfiles;
        }

        if (oldMigratedSettings) {
            localStorage.removeItem(oldSettingsKey);
        }

        let profileIndex = 0
        const storedSelection = +localStorage.getItem(selectedProfileKey);
        if (0 <= storedSelection && storedSelection < this.profiles.length) {
            profileIndex = storedSelection;
        }

        this.selectProfile(profileIndex);
    }

    saveProfiles() {
        setLocalStorageObj(profilesKey, this.profiles);
        setLocalStorageObj(selectedProfileKey, this.selectedProfile);
    }

    syncProfileChange() {
        for (const profile of this.profiles) {
            this.uncompressSavedata(profile.savedata);
            this.settingsMigration.update(profile.savedata);
        }
        this.saveProfiles();
        savedata = this.current().savedata;
    }

    handleProfileChange() {
        this.syncProfileChange();
        populateSettings();
        init();
    }

    current() {
        return this.profiles[this.selectedProfile];
    }

    selectProfile(index) {
        this.selectedProfile = index;
        profileList.style.display = 'none';
        this.handleProfileChange();
        this.renderDropdown();
    }

    deleteProfile(index) {
        this.profiles.splice(index, 1);
        if (this.selectedProfile >= this.profiles.length) {
            this.selectedProfile = 0;
        }
        this.handleProfileChange();
        this.renderDropdown();
    }

    copySelectedProfile() {
        const curr = this.current();
        const newProfile = {
            savedata: structuredClone(curr.savedata),
            name: this.updateNameNumber(curr.name),
            id: this.generateShortId(),
        };

        this.profiles.push(newProfile);
        this.selectedProfile = this.profiles.length - 1;
        this.handleProfileChange();
        this.renderDropdown();
        profileInput.select();
    }

    renderDropdown() {
        profileInput.value = this.current().name;
        profileList.innerHTML = '';

        this.profiles.forEach((profile, index) => {
            const selectButton = document.createElement('div');
            selectButton.classList.add('profile-select');
            selectButton.value = index;
            selectButton.textContent = profile.name || '(no name)';
            if (this.selectedProfile === index) {
                selectButton.classList.add('highlight');
            }
            selectButton.addEventListener('click', (event) => {
                event.stopPropagation();
                this.selectProfile(index);
            });

            if (this.profiles.length > 1) {
                const deleteButton = document.createElement('div');
                deleteButton.className = 'profile-delete';
                deleteButton.textContent = 'X';
                deleteButton.addEventListener('click', (event) => {
                    event.stopPropagation();
                    const confirmed = confirm(`Delete ${profile.name}?`);
                    if (confirmed) {
                        this.deleteProfile(index);
                    }
                });

                selectButton.appendChild(deleteButton);
            }
            profileList.appendChild(selectButton);
        });
    }

    rename(newName) {
        this.current().name = newName;
        this.current().id = this.generateShortId();
        this.renderDropdown();
    }

    updateNameNumber(name) {
        const regex = /\((\d+)\)$/;
        const match = name.match(regex);
        if (match) {
            return name.replace(regex, `(${parseInt(match[1])+1})`)
        } else {
            return name + ' (1)';
        }
    }

    generateShortId(length = 9) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';

        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            result += characters[randomIndex];
        }

        return result;
    }

    generateUrl() {
        const savedata = structuredClone(this.current().savedata);
        for (const setting of legacySettings) {
            if (savedata.hasOwnProperty(setting) && defaultSavedata[setting] === savedata[setting]) {
                delete savedata[setting];
            }
        }
        for (const [setting, compressed] of Object.entries(compressedSettings)) {
            if (savedata.hasOwnProperty(setting)) {
                savedata[compressed] = savedata[setting];
                delete savedata[setting];
            }
        }
        for (const [setting, value] of Object.entries(savedata)) {
            if (typeof value === "boolean") {
                savedata[setting] = value ? 1 : 0;
            }
        }
        const savedataString = JSON.stringify(savedata);
        const encodedSaveData = encodeURIComponent(savedataString);
        const encodedId = encodeURIComponent(this.generateShortId(10));
        const encodedName = encodeURIComponent(this.current().name);
        const url = `${window.location.origin}${window.location.pathname}?id=${encodedId}&name=${encodedName}&savedata=${encodedSaveData}`;
        return url;
    }

    removeSearchParams() {
        const newUrl = window.location.origin + window.location.pathname;
        window.history.replaceState({}, "", newUrl);
    }

    loadUrl() {
        const url = window.location.href;
        const urlObj = new URL(url);
        this.removeSearchParams();
        const encodedId = urlObj.searchParams.get("id");
        const encodedSavedata = urlObj.searchParams.get("savedata");
        const encodedName = urlObj.searchParams.get("name");
        if (!encodedId || !encodedSavedata || !encodedName) {
            return;
        }

        function sanitizeInput(value) {
            return (value.length < 40) ? value.replace(/<[^>]*>/g, "") : '';
        }

        let id = sanitizeInput(decodeURIComponent(encodedId));
        if (!id) {
            return;
        }
        let name = sanitizeInput(decodeURIComponent(encodedName));
        if (!name) {
            name = 'Imported';
        }

        for (const profile of this.profiles) {
            if (profile.id === id) {
                return;
            }

            if (profile.name === name) {
                name = this.updateNameNumber(encodedName);
            }
        }
        const savedataString = decodeURIComponent(encodedSavedata);
        const savedataObj = JSON.parse(savedataString);
        if (!savedataObj) {
            return;
        }

        this.uncompressSavedata(savedataObj);

        const unsafeKeys = Object.keys(savedataObj);
        for (const key in unsafeKeys) {
            if (!defaultSavedata.hasOwnProperty(key)) {
                delete savedataObj[key];
                continue;
            }

            if (typeof savedataObj[key] === "string") {
                savedataObj[key] = sanitizeInput(savedataObj[key]);
            }
        }

        for (const [key, defaultValue] in Object.entries(defaultSavedata)) {
            if (!savedataObj.hasOwnProperty(key)) {
                savedataObj[key] = defaultValue;
            }
        }

        const newProfile = {
            id,
            name,
            savedata: savedataObj,
        };

        this.profiles.push(newProfile);
        this.selectedProfile = this.profiles.length - 1;
        this.handleProfileChange();
        this.renderDropdown();
    }

    uncompressSavedata(savedataObj) {
        for (const [setting, compressed] of Object.entries(compressedSettings)) {
            if (savedataObj.hasOwnProperty(compressed)) {
                savedataObj[setting] = savedataObj[compressed];
                delete savedataObj[compressed];
            }
        }

        for (const [setting, value] of Object.entries(savedataObj)) {
            if ((typeof defaultSavedata[setting] === 'boolean') && (typeof value === 'number')) {
                savedataObj[setting] = value === 1 ? true : false;
            }
        }
    }
}

const PROFILE_STORE = new ProfileStore();

profileArrow.addEventListener('click', () => {
    profileList.style.display = profileList.style.display === 'block' ? 'none' : 'block';
});

document.addEventListener('click', (event) => {
    if (!profileDropdown.contains(event.target)) {
        profileList.style.display = 'none';
    }
});

profilePlus.addEventListener('click', e => {
    PROFILE_STORE.copySelectedProfile();
});

profileShare.addEventListener('click', e => {
    const url = PROFILE_STORE.generateUrl();
    navigator.clipboard.writeText(url);
    profileCopied.classList.add('toast');
    setTimeout(() => {
        profileCopied.classList.remove('toast');
    }, 1000);
});

function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

let saveRename = debounce(() => { PROFILE_STORE.syncProfileChange(); }, 300);
profileInput.addEventListener('input', e => {
    PROFILE_STORE.rename(e.target.value);
    saveRename();
});



/* ---- js/graph.js ---- */


class ProgressGraph {
    constructor() {
        this.scoreChart = null;
        this.countChart = null;
        this.timeChart = null;
        this.timePerPremiseChart = null;
    }

    findDay(question) {
        const adjustedTimestamp = question.timestamp - (4 * 60 * 60 * 1000);
        const date = new Date(adjustedTimestamp);

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    }

    calculateTypeData(data, groupByPremises) {
        const groupedByType = {};

        data.forEach((question) => {
            const day = this.findDay(question);

            const isRight = question.correctness === 'right';
            if (groupByPremises && !isRight) {
                return;
            }
            const timeElapsed = question.timeElapsed;

            let type = question.type + (groupByPremises ? (' p' + question.premises) : '');
            if (question.modifiers && question.modifiers.length > 0) {
                type += ` ${question.modifiers.join('-')}`;
            }
            if (question.tags && question.tags.length > 0) {
                type += ` ${question.tags.join('-')}`;
            }

            if (!groupedByType[type]) {
                groupedByType[type] = {};
            }

            if (!groupedByType[type][day]) {
                groupedByType[type][day] = { totalTime: 0, count: 0 };
            }

            groupedByType[type][day].totalTime += timeElapsed;
            groupedByType[type][day].count += 1;
            groupedByType[type][day].numPremises = question.premises;
        });

        const result = {};
        for (const type in groupedByType) {
            result[type] = [];
            for (const day in groupedByType[type]) {
                const count = groupedByType[type][day].count;
                const numPremises = groupedByType[type][day].numPremises;
                const averageTime = groupedByType[type][day].totalTime / count;
                result[type].push({ day, count, averageTime: averageTime / 1000, numPremises });
            }
            result[type].sort((a, b) => new Date(a.day) - new Date(b.day));
        }

        return result;
    }

    calculateTimeSpentData(data) {
        const groupedByDay = {};

        data.forEach((question) => {
            const day = this.findDay(question);
            if (!groupedByDay[day]) {
                groupedByDay[day] = 0;
            }

            groupedByDay[day] += question.timeElapsed / 1000 / 60;
        });

        const result = [];
        for (const day in groupedByDay) {
            result.push({ day, time: groupedByDay[day]});
        }

        result.sort((a, b) => new Date(a.day) - new Date(b.day));
        return result;
    }

    async plotData() {
        if (this.scoreChart) {
            this.scoreChart.destroy();
            this.scoreChart = null;
        }
        if (this.countChart) {
            this.countChart.destroy();
            this.countChart = null;
        }
        if (this.timeChart) {
            this.timeChart.destroy();
            this.timeChart = null;
        }
        if (this.timePerPremiseChart) {
            this.timePerPremiseChart.destroy();
            this.timePerPremiseChart = null;
        }
        await this.plotScore();
    }

    randomColor() {
        const r = Math.floor(Math.random() * 128 + 72);
        const g = Math.floor(Math.random() * 128 + 72);
        const b = Math.floor(Math.random() * 128 + 72);
        return `rgb(${r}, ${g}, ${b})`;
    }

    async plotScore() {
        let data = await getAllRRTProgress();
        data = data.filter(q => q.timeElapsed >= 1500);
        if (!data || data.length === 0) {
            return;
        }
        const typeData = this.calculateTypeData(data, false);
        const premiseLevelData = this.calculateTypeData(data, true);

        const labels = Object.values(typeData)[0].map(entry => entry.day);
        const premiseLevelLabels = Object.values(premiseLevelData)[0].map((entry) => entry.day);

        const scoreDatasets = Object.keys(premiseLevelData).map((type) => {
            return {
                label: type,
                data: premiseLevelData[type].map((entry) => ({ x: entry.day, y: entry.averageTime })),
                borderColor: this.randomColor(),
                fill: false,
            };
        });

        const timePerPremiseDatasets = Object.keys(premiseLevelData).map(type => {
            return {
                label: type,
                data: premiseLevelData[type].map((entry) => ({ x: entry.day, y: entry.numPremises / entry.averageTime })),
                borderColor: this.randomColor(),
                fill: false,
            };
        });

        const countDatasets = Object.keys(typeData).map((type) => {
            return {
                label: type,
                data: typeData[type].map((entry) => ({ x: entry.day, y: entry.count })),
                borderColor: this.randomColor(),
            };
        });

        const timeData = this.calculateTimeSpentData(data);
        const totalTimeSpent = timeData.map(entry => entry.time).reduce((a,b) => a + b, 0);
        const totalHours = totalTimeSpent / 60;
        const extraMinutes = totalTimeSpent % 60;
        const totalTimeSpentDisplay = `Total = ${totalHours.toFixed(0)}h ${extraMinutes.toFixed(0)}m`
        const timeDatasets = [{
            label: `Time Spent (Minutes)`,
            data: timeData.map(entry => ({ x: entry.day, y: entry.time })),
            backgroundColor: this.randomColor(),
        }];

        const scoreCtx = canvasScore.getContext('2d');
        this.scoreChart = this.createChart(scoreCtx, premiseLevelLabels, scoreDatasets, 'line', 'Average Correct Time (s)', 1, 2, 's');
        const countCtx = canvasCount.getContext('2d');
        this.countChart = this.createChart(countCtx, labels, countDatasets, 'line', 'Count', 0, 0);
        const timeCtx = canvasTime.getContext('2d');
        this.timeChart = this.createChart(timeCtx, labels, timeDatasets, 'bar', 'Time Spent', 1, 2, '', totalTimeSpentDisplay);
        const timePerPremiseCtx = canvasTimePerPremise.getContext('2d');
        this.timePerPremiseChart = this.createChart(timePerPremiseCtx, premiseLevelLabels, timePerPremiseDatasets, 'line', 'Premise / second', 1, 2, ' premise/s');
    }

    createChart(ctx, labels, datasets, type, yAxisTitle, tickDecimals = 1, tooltipDecimals = 2, unit='', subtitle) {
        return new Chart(ctx, {
            type: type,
            data: {
                labels,
                datasets,
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    duration: 0,
                },
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            unit: 'day',
                            tooltipFormat: 'yyyy-MM-dd',
                        },
                        title: {
                            display: true,
                            text: 'Day',
                        },
                    },
                    y: {
                        title: {
                            display: true,
                            text: yAxisTitle,
                        },
                        ticks: {
                            callback: function (value) {
                                return value.toFixed(1);
                            }
                        }
                    },
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(tooltipItem) {
                                let value = tooltipItem.raw;
                                return `${tooltipItem.dataset.label}: ${value.y.toFixed(2)}${unit}`;
                            }
                        }
                    },
                    subtitle: {
                        display: subtitle ? true : false,
                        text: subtitle,
                        align: 'end',
                        color: '#EEEEEE',
                    }
                },
            },
        });
    }

    createGraph() {
        graphPopup.classList.add('visible');
        this.plotData();
    }

    clearGraph() {
        graphPopup.classList.remove('visible');
    }
}

const graphPopup = document.getElementById('graph-popup');
const graphClose = document.getElementById('graph-close-popup');
const graphButton = document.getElementById('graph-label');

const graphTime = document.getElementById('graph-popup-time');
const graphCount = document.getElementById('graph-popup-count');
const graphScore = document.getElementById('graph-popup-score');
const graphTimePerPremise = document.getElementById('graph-popup-time-per-premise');
const graphs = [graphTime, graphCount, graphScore, graphTimePerPremise];

const canvasTime = document.getElementById('graph-canvas-time');
const canvasCount = document.getElementById('graph-canvas-count');
const canvasScore = document.getElementById('graph-canvas-score');
const canvasTimePerPremise = document.getElementById('graph-canvas-time-per-premise');
const canvases = [canvasTime, canvasCount, canvasScore, canvasTimePerPremise];

const graphTimeSelect = document.getElementById('graph-select-time');
const graphCountSelect = document.getElementById('graph-select-count');
const graphScoreSelect = document.getElementById('graph-select-score');
const graphTimePerPremiseSelect = document.getElementById('graph-select-time-per-premise');
const graphSelects = [graphTimeSelect, graphCountSelect, graphScoreSelect, graphTimePerPremiseSelect];

graphTimeSelect.addEventListener('click', () => {
    graphs.forEach(graph => graph.classList.remove('visible'));
    graphSelects.forEach(select => select.classList.remove('selected'));
    graphTime.classList.add('visible');
    graphTimeSelect.classList.add('selected');
});

graphCountSelect.addEventListener('click', () => {
    graphs.forEach(graph => graph.classList.remove('visible'));
    graphSelects.forEach(select => select.classList.remove('selected'));
    graphCount.classList.add('visible');
    graphCountSelect.classList.add('selected');
});

graphScoreSelect.addEventListener('click', () => {
    graphs.forEach(graph => graph.classList.remove('visible'));
    graphSelects.forEach(select => select.classList.remove('selected'));
    graphScore.classList.add('visible');
    graphScoreSelect.classList.add('selected');
});

graphTimePerPremiseSelect.addEventListener('click', () => {
    graphs.forEach(graph => graph.classList.remove('visible'));
    graphSelects.forEach(select => select.classList.remove('selected'));
    graphTimePerPremise.classList.add('visible');
    graphTimePerPremiseSelect.classList.add('selected');
});

const PROGRESS_GRAPH = new ProgressGraph();

graphClose.addEventListener('click', () => {
    PROGRESS_GRAPH.clearGraph();
});

graphButton.addEventListener('click', () => {
    PROGRESS_GRAPH.createGraph();
});

document.addEventListener('click', (event) => {
  if (graphPopup.classList.contains('visible') && !graphPopup.contains(event.target) && !graphButton.contains(event.target)) {
      PROGRESS_GRAPH.clearGraph();
  }
});



/* ---- js/progress.js ---- */


const TYPE_TO_OVERRIDES = {
    "distinction"  : [ "overrideDistinctionPremises", "overrideDistinctionTime" ],
    "linear"       : [ "overrideLinearPremises"     , "overrideLinearTime" ],
    "syllogism"    : [ "overrideSyllogismPremises"  , "overrideSyllogismTime" ],
    "binary"       : [ "overrideBinaryPremises"     , "overrideBinaryTime" ],
    "space-two-d"  : [ "overrideDirectionPremises"  , "overrideDirectionTime" ],
    "space-three-d": [ "overrideDirection3DPremises", "overrideDirection3DTime" ],
    "space-time"   : [ "overrideDirection4DPremises", "overrideDirection4DTime" ],
    "anchor-space" : [ "overrideAnchorSpacePremises", "overrideAnchorSpaceTime" ],
};

const COMMON_TYPES = [
    ["linear", "distinction", "syllogism"],
]

const COMMON_TYPES_TABLE = COMMON_TYPES.reduce((acc, types) => {
    for (let i = 0; i < types.length; i++) {
        for (let j = i+1; j < types.length; j++) {
            acc[types[i]] = acc[types[i]] || [types[i]];
            acc[types[j]] = acc[types[j]] || [types[j]];
            acc[types[i]].push(types[j]);
            acc[types[j]].push(types[i]);
        }
    }
    return acc;
}, {});


const progressTracker = document.getElementById("progress-tracker");
const dailyProgressTracker = document.getElementById("daily-progress-container");
const weeklyProgressTracker = document.getElementById("weekly-progress-container");

function findSuccessCriteria() {
    return Math.max(50, Math.min(savedata.autoProgressionPercentSuccess, 100));
}

function findFailureCriteria() {
    const failureCriteria = Math.max(0, Math.min(savedata.autoProgressionPercentFail, 99));
    return Math.min(failureCriteria, findSuccessCriteria());
}

function findAutoProgressionTrailing() {
    return Math.max(5, Math.min(savedata.autoProgressionTrailing, 50));
}

class ProgressStore {
    calculateKey(question) {
        return this.calculateKeyFromCustomType(question, question.type);
    }

    calculateKeyFromCustomType(question, type) {
        let plen = question.premises;
        let countdown = question.countdown;
        let key = `${type}-${plen}-${countdown}`;
        if (question.modifiers && question.modifiers.length !== 0) {
            key += `-${question.modifiers.join('-')}`
        }
        return key;
    }

    findCommonTypes(question) {
        if (savedata.autoProgressionGrouping === 'simple') {
            return COMMON_TYPES_TABLE[question.type] || [question.type];
        } else {
            return [question.type];
        }
    }

    calculateCommonKeys(question) {
        const types = this.findCommonTypes(question);
        types.sort();
        return types.map(type => this.calculateKeyFromCustomType(question, type));
    }

    convertForDatabase(question) {
        const q = {...question};
        q.timestamp = q.answeredAt;
        q.timeElapsed = q.answeredAt - q.startedAt;
        q.premises = q.plen || q.premises.length;
        q.countdown = q.tlen || q.countdown || savedata.timer;
        // Persist settings needed for leaderboards (kept lightweight).
        q.scrambleFactor = savedata.scrambleFactor;
        q.key = this.calculateKey(q);
        delete q.plen;
        delete q.startedAt;
        delete q.answeredAt;
        delete q.wordCoordMap;
        delete q.bucket;
        delete q.buckets;
        delete q.operations;
        delete q.conclusion;
        delete q.isValid;
        delete q.answerUser;
        delete q.category;
        delete q.subresults;
        delete q.tlen;
        return q;
    }

    async storeCompletedQuestion(question) {
        const q = this.convertForDatabase(question);
        if (savedata.autoProgression) {
            await this.determineLevelChange(q);
        }
        await storeProgressData(q);
    }

    success(q, trailingProgress, successes, type) {
        const [overridePremiseSetting, overrideTimerSetting] = TYPE_TO_OVERRIDES[type];
        let newTimerValue;
        if (savedata.autoProgressionChange === 'auto') {
            const minUpgrade = q.countdown - 1;
            const left = successes[successes.length - 3].timeElapsed / 1000;
            const right = successes[successes.length - 2].timeElapsed / 1000;
            const percentile90ish = Math.floor((left + right) / 2) + 1;
            newTimerValue = Math.min(minUpgrade, percentile90ish);
        } else {
            newTimerValue = q.countdown - savedata.autoProgressionTimeDrop;
        }
        newTimerValue = Math.max(1, newTimerValue);
        const averageTime = successes.map(s => s.timeElapsed / 1000).reduce((a, b) => a + b) / successes.length;
        if (averageTime <= savedata.autoProgressionGoal || newTimerValue <= savedata.autoProgressionGoal) {
            savedata[overridePremiseSetting] = q.premises + 1;
            savedata[overrideTimerSetting] = savedata.autoProgressionGoal + 15;
        } else {
            savedata[overrideTimerSetting] = newTimerValue;
        }
    }

    fail(q, trailingProgress, successes, type) {
        const [overridePremiseSetting, overrideTimerSetting] = TYPE_TO_OVERRIDES[type];
        let newTimerValue;
        if (savedata.autoProgressionChange === 'auto') {
            newTimerValue = q.countdown + 5;
        } else {
            newTimerValue = q.countdown + savedata.autoProgressionTimeBump;
        }
        if (newTimerValue > savedata.autoProgressionGoal + 25) {
            if (q.premises > 2) {
                savedata[overridePremiseSetting] = q.premises - 1;
                savedata[overrideTimerSetting] = savedata.autoProgressionGoal + 20;
            } else {
                savedata[overrideTimerSetting] = Math.min(newTimerValue, 60);
            }
        } else {
            savedata[overrideTimerSetting] = newTimerValue;
        }
    }

    async determineLevelChange(q) {
        let trailingProgress = await getTopRRTProgress(this.calculateCommonKeys(q), findAutoProgressionTrailing() - 1);
        trailingProgress.push(q);
        trailingProgress.sort((a, b) => a.timeElapsed - b.timeElapsed);
        const successes = trailingProgress.filter(p => p.correctness === 'right');
        const commonTypes = this.findCommonTypes(question);
        if (trailingProgress.length < findAutoProgressionTrailing()) {
            const numFailures = trailingProgress.length - successes.length;
            const bestPercentagePossible = 100 * (findAutoProgressionTrailing() - numFailures) / findAutoProgressionTrailing();
            if (bestPercentagePossible <= findFailureCriteria()) {
                for (const type of commonTypes) {
                    this.fail(q, trailingProgress, successes, type);
                }
                q.didTriggerProgress = true;
            }
            populateSettings();
            return;
        }
        for (const type of commonTypes) {
            const percentageRight = 100 * successes.length / findAutoProgressionTrailing();
            if (percentageRight >= findSuccessCriteria()) {
                this.success(q, trailingProgress, successes, type);
                q.didTriggerProgress = true;
            } else if (percentageRight <= findFailureCriteria()) {
                this.fail(q, trailingProgress, successes, type);
                q.didTriggerProgress = true;
            }
        }
        populateSettings();
    }

    async renderCurrentProgress(question) {
        await this.renderAutoProgressionTrailing(question);
        await this.renderDailyProgress();
        await this.renderWeeklyProgress();
    }

    async renderAutoProgressionTrailing(question) {
        const q = this.convertForDatabase(question);
        let trailingProgress = await getTopRRTProgress(this.calculateCommonKeys(q), findAutoProgressionTrailing());
        progressTracker.innerHTML = '';
        if (!savedata.autoProgression) {
            progressTracker.classList.remove('visible');
            return;
        } 
        progressTracker.classList.add('visible');
        const width = 100 / findAutoProgressionTrailing();
        trailingProgress.forEach(q => {
            const isSuccess = q.correctness === 'right';
            const span = document.createElement('span');
            span.classList.add('trailing-dot');
            span.style.width = `${width.toFixed(2)}%`;
            span.classList.add(isSuccess ? 'success' : 'fail');
            progressTracker.appendChild(span);
        });
    }

    async renderDailyProgress() {
        if (!savedata.dailyProgressGoal) {
            dailyProgressTracker.classList.remove('visible');
            return;
        }
        dailyProgressTracker.classList.add('visible');
        const progressToday = await getTodayRRTProgress();
        const minutesSpent = progressToday.map(q => q.timeElapsed).reduce((a, b) => a + b, 0) / 1000 / 60;
        this.fillProgressTracker(dailyProgressTracker, minutesSpent, savedata.dailyProgressGoal);
    }

    async renderWeeklyProgress() {
        if (!savedata.weeklyProgressGoal) {
            weeklyProgressTracker.classList.remove('visible');
            return;
        }
        weeklyProgressTracker.classList.add('visible');
        const progressWeek = await getWeekRRTProgress();
        const minutesSpent = progressWeek.map(q => q.timeElapsed).reduce((a, b) => a + b, 0) / 1000 / 60;
        this.fillProgressTracker(weeklyProgressTracker, minutesSpent, savedata.weeklyProgressGoal);
    }

    fillProgressTracker(tracker, minutesSpent, goal) {
        const percentComplete = Math.max(0, Math.min(100 * minutesSpent / goal, 100));
        tracker.querySelector('.progress-fill').style.height = `${percentComplete}%`;
        tracker.querySelector('.progress-value').innerText = `${Math.floor(minutesSpent)} / ${goal}`;
        if (percentComplete >= 100) {
            tracker.querySelector('.progress-fill').classList.remove('halfway');
            tracker.querySelector('.progress-fill').classList.add('complete');
        } else if (percentComplete >= 50) {
            tracker.querySelector('.progress-fill').classList.add('halfway');
            tracker.querySelector('.progress-fill').classList.remove('complete');
        } else {
            tracker.querySelector('.progress-fill').classList.remove('halfway');
            tracker.querySelector('.progress-fill').classList.remove('complete');
        }
    }
}

const PROGRESS_STORE = new ProgressStore();



/* ---- js/error-handling.js ---- */


const errorPopup = document.getElementById('error-popup');
const errorMessage = document.getElementById('error-message');
const errorStack = document.getElementById('error-stack');
const closePopupButton = document.getElementById('error-close-popup');

function showErrorPopup(message, stack) {
  errorMessage.textContent = message;
  errorStack.value = stack;
  errorPopup.style.display = 'flex';
}

function hideErrorPopup() {
  errorPopup.style.display = 'none';
}

window.onerror = function (message, source, lineno, colno, error) {
  const errorDetails = `Error: ${message}\nSource: ${source}\nLine: ${lineno}\nColumn: ${colno}`;
  const stackTrace = error ? error.stack : 'No stack trace available.';
  showErrorPopup(errorDetails, stackTrace);
};

closePopupButton.addEventListener('click', hideErrorPopup);



/* ---- js/sidebar-events.js ---- */


const sylSettingsCheckbox = document.getElementById('offcanvas-settings');
const sylSettingsSidebar = document.getElementById('sidebar-settings');
const sylHistoryCheckbox = document.getElementById('offcanvas-history');
const sylHistorySidebar = document.getElementById('sidebar-history');
const sylCreditsCheckbox = document.getElementById('offcanvas-credits');
const sylCreditsSidebar = document.getElementById('sidebar-credits');

document.addEventListener('click', (event) => {
  if (!sylSettingsCheckbox.contains(event.target) && !sylSettingsSidebar.contains(event.target)) {
    sylSettingsCheckbox.checked = false;
  }
  if (!sylHistoryCheckbox.contains(event.target) && !sylHistorySidebar.contains(event.target)) {
    sylHistoryCheckbox.checked = false;
  }
  if (!sylCreditsCheckbox.contains(event.target) && !sylCreditsSidebar.contains(event.target)) {
    sylCreditsCheckbox.checked = false;
  }
});



/* ---- js/index.js ---- */


// Get rid of all the PWA stuff
if ('serviceWorker' in navigator)
    navigator.serviceWorker.getRegistrations()
        .then(registrations => {
            if (registrations.length) for (let r of registrations) r.unregister();
        });

const feedbackWrong = document.querySelector(".feedback--wrong");
const feedbackMissed = document.querySelector(".feedback--missed");
const feedbackRight = document.querySelector(".feedback--right");
const trueButton = document.getElementById("true-button");
const falseButton = document.getElementById("false-button");

const correctlyAnsweredEl = document.querySelector(".correctly-answered");
const nextLevelEl = document.querySelector(".next-level");

const backgroundDiv = document.querySelector('.background-image');
let imageChanged = true;

const timerInput = document.querySelector("#timer-input");
const timerToggle = document.querySelector("#timer-toggle");
const timerBar = document.querySelector(".timer__bar");
const customTimeInfo = document.querySelector(".custom-time-info");
let timerToggled = false;
let timerTime = 30;
let timerCount = 30;
let timerInstance;
let timerRunning = false;
let processingAnswer = false;

const historyList = document.getElementById("history-list");
const historyButton = document.querySelector(`label.open[for="offcanvas-history"]`);
const historyCheckbox = document.getElementById("offcanvas-history");
const settingsButton = document.querySelector(`label.open[for="offcanvas-settings"]`);
const totalDisplay = document.getElementById("total-display");
const averageDisplay = document.getElementById("average-display");
const averageCorrectDisplay = document.getElementById("average-correct-display");
const percentCorrectDisplay = document.getElementById("percent-correct-display");

let carouselIndex = 0;
let carouselEnabled = false;
let question;
const carousel = document.querySelector(".carousel");
const carouselDisplayLabelType = carousel.querySelector(".carousel_display_label_type");
const carouselDisplayLabelProgress = carousel.querySelector(".carousel_display_label_progress");
const carouselDisplayText = carousel.querySelector(".carousel_display_text");
const carouselBackButton = carousel.querySelector("#carousel-back");
const carouselNextButton = carousel.querySelector("#carousel-next");

const display = document.querySelector(".display-outer");
const displayLabelType = display.querySelector(".display_label_type");
const displayLabelLevel = display.querySelector(".display_label_level");;
const displayText = display.querySelector(".display_text");;

const liveStyles = document.getElementById('live-styles');
const gameArea = document.getElementById('game-area');
const spoilerArea = document.getElementById('spoiler-area');

const confirmationButtons = document.querySelector(".confirmation-buttons");
let imagePromise = Promise.resolve();

const keySettingMapInverse = Object.entries(keySettingMap)
    .reduce((a, b) => (a[b[1]] = b[0], a), {});

carouselBackButton.addEventListener("click", carouselBack);
carouselNextButton.addEventListener("click", carouselNext);

function isKeyNullable(key) {
    return key.endsWith("premises") || key.endsWith("time") || key.endsWith("optional");
}

function registerEventHandlers() {
    for (const key in keySettingMap) {
        const value = keySettingMap[key];
        const input = document.querySelector("#" + key);

        // Checkbox handler
        if (input.type === "checkbox") {
            input.addEventListener("input", evt => {
                savedata[value] = !!input.checked;
                refresh();
            });
        }

        // Number handler
        if (input.type === "number") {
            input.addEventListener("input", evt => {

                let num = input?.value;
                if (num === undefined || num === null || num === '')
                    num = null;
                if (input.min && +num < +input.min)
                    num = null;
                if (input.max && +num > +input.max)
                    num = null;

                if (num == null) {
                    if (isKeyNullable(key)) {
                        savedata[value] = null;
                    } else {
                        // Fix infinite loop on mobile when changing # of premises
                        return;
                    }
                } else {
                    savedata[value] = +num;
                }
                refresh();
            });
        }

        if (input.type === "select-one") {
            input.addEventListener("change", evt => {
                savedata[value] = input.value;
                refresh();
            })
        }
    }
}

function save() {
    PROFILE_STORE.saveProfiles();
    setLocalStorageObj(appStateKey, appState);
}

function appStateStartup() {
    const appStateObj = getLocalStorageObj(appStateKey);
    if (appStateObj) {
        Object.assign(appState, appStateObj);
        if (typeof appState.rankPoints !== "number" || !Number.isFinite(appState.rankPoints)) {
            appState.rankPoints = 0;
        }
        if (appState.rankPoints < 0) appState.rankPoints = 0;
        setLocalStorageObj(appStateKey, appState);
    }
}

function load() {
    appStateStartup();
    PROFILE_STORE.startup();

    renderHQL();
    renderFolders();
    populateSettings();
}

function populateSettings() {
    for (let key in savedata) {
        if (!(key in keySettingMapInverse)) continue;
        let value = savedata[key];
        let id = keySettingMapInverse[key];
        
        const input = document.querySelector("#" + id);
        if (input.type === "checkbox") {
            if (value === true || value === false) {
                input.checked = value;
            }
        }
        else if (input.type === "number") {
            if (!value && isKeyNullable(id)) {
                input.value = '';
            } else if (typeof value === "number") {
                input.value = +value;
            }
        }
        else if (input.type === "text") {
            input.value = value;
        } else if (input.type === "select-one") {
            input.value = value;
        }
    }

    populateLinearDropdown();
    populateProgressionDropdown();
    populateAppearanceSettings();

    timerInput.value = savedata.timer;
    timerTime = timerInput.value;
}

function refresh() {
    save();
    populateSettings();
    init();
}

function carouselInit() {
    carouselIndex = 0;
    renderCarousel();
}

function displayInit() {
    const q = renderJunkEmojis(question);
    displayLabelType.textContent = q.category.split(":")[0];
    displayLabelLevel.textContent = (q.plen || q.premises.length) + "p";
    const easy = savedata.scrambleFactor < 12 ? ' (easy)' : '';
    displayText.innerHTML = [
        `<div class="preamble">Premises${easy}</div>`,
        ...q.premises.map(p => `<div class="formatted-premise">${p}</div>`),
        ...((q.operations && q.operations.length > 0) ? ['<div class="transform-header">Transformations</div>'] : []),
        ...(q.operations ? q.operations.map(o => `<div class="formatted-operation">${o}</div>`) : []),
        '<div class="postamble">Conclusion</div>',
        '<div class="formatted-conclusion">'+q.conclusion+'</div>',
    ].join('');
    const isAnalogy = question?.tags?.includes('analogy');
    const isBinary = question.type === 'binary';
    if (savedata.minimalMode && question.type !== 'syllogism') {
        displayText.classList.add('minimal');
    } else {
        displayText.classList.remove('minimal');
    }

    if (savedata.widePremises && question.type !== 'syllogism') {
        displayText.classList.add('wide-premises');
        gameArea.classList.add('wide-premises');
    } else {
        displayText.classList.remove('wide-premises');
        gameArea.classList.remove('wide-premises');
    }

    if (isAnalogy || isBinary) {
        displayText.classList.add('complicated-conclusion');
    } else {
        displayText.classList.remove('complicated-conclusion');
    }

    if (q.premises.length > 12) {
        displayText.classList.add('big-question');
    } else {
        displayText.classList.remove('big-question');
    }

    imagePromise = imagePromise.then(() => updateCustomStyles());

    if (appState.darkMode) {
        document.body.classList.remove('light-mode');
    } else {
        document.body.classList.add('light-mode');
    }
}

function clearBackgroundImage() {
    const fileInput = document.getElementById('image-upload');
    fileInput.value = '';
    delete appState.backgroundImage;
    imageChanged = true;
    save();
    imagePromise = imagePromise.then(() => deleteImage(imageKey));
    imagePromise = imagePromise.then(() => updateCustomStyles());
}

function handleImageChange(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const base64String = event.target.result;
            appState.backgroundImage = imageKey;
            imagePromise = imagePromise.then(() => storeImage(imageKey, base64String));
            imageChanged = true;
            refresh();
        };
        reader.readAsDataURL(file);
    }
}

function populateAppearanceSettings() {
    document.getElementById('color-input').value = appState.darkMode ? appState.gameAreaColor : appState.gameAreaLightColor;
    document.getElementById('p-sfx').value = appState.sfx;
    document.getElementById('p-fast-ui').checked = appState.fastUi;
    document.getElementById('p-dark-mode').checked = appState.darkMode;
}

function populateProgressionDropdown() {
    const timeBumper = document.getElementById('time-bumper');
    const timeDropper = document.getElementById('time-dropper');
    const isAuto = savedata.autoProgressionChange === 'auto';

    timeBumper.style.display = isAuto ? 'none' : 'flex';
    timeDropper.style.display = isAuto ? 'none' : 'flex';
}


function handleColorChange(event) {
    const color = event.target.value;
    if (appState.darkMode) {
        appState.gameAreaColor = color;
    } else {
        appState.gameAreaLightColor = color;
    }
    refresh();
}

function handleSfxChange(event) {
    appState.sfx = event.target.value;
    refresh();
}

function handleFastUiChange(event) {
    appState.fastUi = event.target.checked;
    removeFastFeedback();
    refresh();
}

function handleDarkModeChange(event) {
    appState.darkMode = event.target.checked;
    refresh();
}

async function updateCustomStyles() {
    let styles = '';
    if (imageChanged) {
        if (appState.backgroundImage) {
            const base64String = await getImage(imageKey);
            if (base64String) {
                const [prefix, base64Data] = base64String.split(',');
                const mimeType = prefix.match(/data:(.*?);base64/)[1];
                const binary = atob(base64Data);
                const len = binary.length;
                const bytes = new Uint8Array(len);
                for (let i = 0; i < len; i++) {
                    bytes[i] = binary.charCodeAt(i);
                }

                const blob = new Blob([bytes], { type: mimeType });
                const objectURL = URL.createObjectURL(blob);

                backgroundDiv.style.backgroundImage = `url(${objectURL})`;
            }
        } else {
            backgroundDiv.style.backgroundImage = ``;
        }
        imageChanged = false;
    }
    if (liveStyles.innerHTML !== styles) {
        liveStyles.innerHTML = styles;
    }

    const gameAreaColor = appState.darkMode ? appState.gameAreaColor : appState.gameAreaLightColor;
    const gameAreaImage = `${gameAreaColor}`
    if (gameArea.style.background !== gameAreaImage) {
        gameArea.style.background = '';
        gameArea.style.background = gameAreaImage;
    }
}

function enableConfirmationButtons() {
    confirmationButtons.style.pointerEvents = "all";
    confirmationButtons.style.opacity = 1;
}

function disableConfirmationButtons() {
    confirmationButtons.style.pointerEvents = "none";
    confirmationButtons.style.opacity = 0;
}

function renderCarousel() {
    if (!savedata.enableCarouselMode) {
        display.classList.add("visible");
        carousel.classList.remove("visible");
        enableConfirmationButtons();
        return;
    }
    const q = renderJunkEmojis(question);

    carousel.classList.add("visible");
    display.classList.remove("visible");
    if (carouselIndex == 0) {
        carouselBackButton.disabled = true;
    } else {
        carouselBackButton.disabled = false;
    }
    
    if (carouselIndex < q.premises.length) {
        carouselNextButton.disabled = false;
        disableConfirmationButtons();
        carouselDisplayLabelType.textContent = "Premise";
        carouselDisplayLabelProgress.textContent = (carouselIndex + 1) + "/" + q.premises.length;
        carouselDisplayText.innerHTML = q.premises[carouselIndex];
    } else if (q.operations && carouselIndex < q.operations.length + q.premises.length) {
        carouselNextButton.disabled = false;
        const operationIndex = carouselIndex - q.premises.length;
        disableConfirmationButtons();
        carouselDisplayLabelType.textContent = "Transformation";
        carouselDisplayLabelProgress.textContent = (operationIndex + 1) + "/" + q.operations.length;
        carouselDisplayText.innerHTML = q.operations[operationIndex];
    } else {
        carouselNextButton.disabled = true;
        enableConfirmationButtons();
        carouselDisplayLabelType.textContent = "Conclusion";
        carouselDisplayLabelProgress.textContent = "";
        carouselDisplayText.innerHTML = q.conclusion;
    }
}

function carouselBack() {
    carouselIndex--;
    renderCarousel();
}
  
function carouselNext() {
    carouselIndex++;
    renderCarousel();
}

function startCountDown() {
    timerRunning = true;
    if (question) {
        question.startedAt = new Date().getTime();
    }
    timerCount = findStartingTimerCount();
    animateTimerBar();
}

function stopCountDown() {
    timerRunning = false;
    timerCount = findStartingTimerCount();
    timerBar.style.width = '100%';
    clearTimeout(timerInstance);
}

function renderTimerBar() {
    const [mode, startingTimerCount] = findStartingTimerState();
    if (mode === 'override') {
        timerBar.classList.add('override');
        customTimeInfo.classList.add('visible');
        customTimeInfo.innerHTML =  '' + startingTimerCount + 's';
    } else {
        timerBar.classList.remove('override');
        customTimeInfo.classList.remove('visible');
        customTimeInfo.innerHTML = '';
    }
    timerBar.style.width = (timerCount / startingTimerCount * 100) + '%';
}

function animateTimerBar() {
    renderTimerBar();
    if (timerCount > 0) {
        timerCount--;
        timerInstance = setTimeout(animateTimerBar, 1000);
    }
    else {
        timeElapsed();
    }
}

function findStartingTimerCount() {
    const [_, count] = findStartingTimerState();
    return count;
}

function findStartingTimerState() {
    if (question) {
        if (question.countdown) {
            return ['override', Math.max(1, question.countdown)];
        } else if (question.timeOffset) {
            return ['override', Math.max(1, +timerTime + question.timeOffset)];
        }
    }
    return ['default', Math.max(1, +timerTime)];
}

function generateQuestion() {
    const analogyEnable = [
        savedata.enableDistinction,
        savedata.enableLinear,
        savedata.enableDirection,
        savedata.enableDirection3D,
        savedata.enableDirection4D,
        savedata.enableAnchorSpace
    ].reduce((a, c) => a + +c, 0) > 0;

    const binaryEnable = [
        savedata.enableDistinction,
        savedata.enableLinear,
        savedata.enableDirection,
        savedata.enableDirection3D,
        savedata.enableDirection4D,
        savedata.enableSyllogism
    ].reduce((a, c) => a + +c, 0) > 1;

    const generators = [];
    let quota = savedata.premises;
    quota = Math.max(2, quota);
    quota = Math.min(quota, maxStimuliAllowed());

    const banNormalModes = savedata.onlyAnalogy || savedata.onlyBinary;
    if (!banNormalModes) {
        if (savedata.enableDistinction)
            generators.push(createDistinctionGenerator(quota));
        if (savedata.enableLinear)
            generators.push(...createLinearGenerators(quota));
        if (savedata.enableSyllogism)
            generators.push(createSyllogismGenerator(quota));
        if (savedata.enableDirection)
            generators.push(createDirectionGenerator(quota));
        if (savedata.enableDirection3D)
            generators.push(createDirection3DGenerator(quota));
        if (savedata.enableDirection4D)
            generators.push(createDirection4DGenerator(quota));
        if (savedata.enableAnchorSpace)
            generators.push(createAnchorSpaceGenerator(quota));
    }
    if (
     savedata.enableAnalogy
     && !savedata.onlyBinary
     && analogyEnable
    ) {
        generators.push(createAnalogyGenerator(quota));
    }

    const binaryQuota = getPremisesFor('overrideBinaryPremises', quota);
    if (
     savedata.enableBinary
     && !savedata.onlyAnalogy
     && binaryEnable
    ) {
        if ((savedata.maxNestedBinaryDepth ?? 1) <= 1)
            generators.push(createBinaryGenerator(quota));
        else
            generators.push(createNestedBinaryGenerator(quota));
    }

    if (savedata.enableAnalogy && !analogyEnable) {
        alert('ANALOGY needs at least 1 other question class (SYLLOGISM and BINARY do not count).');
        if (savedata.onlyAnalogy)
            return;
    }

    if (savedata.enableBinary && !binaryEnable) {
        alert('BINARY needs at least 2 other question class (ANALOGY do not count).');
        if (savedata.onlyBinary)
            return;
    }
    if (generators.length === 0)
        return;

    const totalWeight = generators.reduce((sum, item) => sum + item.weight, 0);
    const randomValue = Math.random() * totalWeight;
    let cumulativeWeight = 0;
    let q;
    for (let generator of generators) {
        cumulativeWeight += generator.weight;
        if (randomValue < cumulativeWeight) {
            q = generator.question.create(generator.premiseCount);
            break;
        }
    }

    if (!savedata.removeNegationExplainer && /is-negated/.test(JSON.stringify(q)))
        q.premises.unshift('<span class="negation-explainer">Invert the <span class="is-negated">Red</span> text</span>');

    return q;
}

function init() {
    stopCountDown();
    question = generateQuestion();
    if (!question) {
        return;
    }

    stopCountDown();
    if (timerToggled) {
        startCountDown();
    } else {
        renderTimerBar();
    }

    carouselInit();
    displayInit();
    PROGRESS_STORE.renderCurrentProgress(question);
    renderConclusionSpoiler();
}

function renderConclusionSpoiler() {
    if (savedata.spoilerConclusion) {
        spoilerArea.classList.add('spoiler');
    } else {
        spoilerArea.classList.remove('spoiler');
    }
}

const DEFAULT_SOUNDS = {
    success: { audio: new Audio('sounds/default/success.mp3'), time: 2000},
    failure: { audio: new Audio('sounds/default/failure.mp3'), time: 1400},
    missed: { audio: new Audio('sounds/default/missed.mp3'), time: 1400},
}

const ZEN_SOUNDS = {
    success: { audio: new Audio('sounds/zen/success.mp3'), time: 2000 },
    failure: { audio: new Audio('sounds/zen/failure.mp3'), time: 1400 },
    missed: { audio: new Audio('sounds/zen/missed.mp3'), time: 1400 },
}

function playSoundFor(sound, duration) {
    sound.currentTime = 0;
    sound.volume = 0.6;
    sound.play();

    setTimeout(() => {
        let fadeOut = setInterval(() => {
            if (sound.volume > 0.10) {
                sound.volume -= 0.10;
            } else {
                clearInterval(fadeOut);
                sound.pause();
                sound.currentTime = 0;
                sound.volume = 0.6;
            }
        }, 100);
    }, duration - 600);
}

function getCurrentSoundPack() {
    if (appState.sfx === 'sfx1') {
        return DEFAULT_SOUNDS;
    } else if (appState.sfx === 'sfx2') {
        return ZEN_SOUNDS;
    }
    return null;
}

function playSound(property) {
    const sounds = getCurrentSoundPack();
    if (sounds) {
        playSoundFor(sounds[property].audio, sounds[property].time);
    }
}

function removeFastFeedback() {
    gameArea.classList.remove('right');
    gameArea.classList.remove('wrong');
    gameArea.classList.remove('missed');
}

let fastFeedbackTimer = null;
function fastFeedback(cb, className) {
    if (fastFeedbackTimer) {
        clearTimeout(fastFeedbackTimer);
        fastFeedbackTimer = null;
    }
    removeFastFeedback();
    gameArea.classList.add(className);
    setTimeout(() => {
        cb();
        processingAnswer = false;
        fastFeedbackTimer = setTimeout(() => {
            removeFastFeedback();
        }, 1000);
    }, 350);
}

function wowFeedbackRight(cb) {
    playSound('success');
    if (appState.fastUi) {
        fastFeedback(cb, 'right');
    } else {
        feedbackRight.classList.add("active");
        setTimeout(() => {
            feedbackRight.classList.remove("active");
            cb();
            processingAnswer = false;
        }, 1000);
    }
}

function wowFeedbackWrong(cb) {
    playSound('failure');
    if (appState.fastUi) {
        fastFeedback(cb, 'wrong');
    } else {
        feedbackWrong.classList.add("active");
        setTimeout(() => {
            feedbackWrong.classList.remove("active");
            cb();
            processingAnswer = false;
        }, 1000);
    }
}

function wowFeedbackMissed(cb) {
    playSound('missed');
    if (appState.fastUi) {
        fastFeedback(cb, 'missed');
    } else {
        feedbackMissed.classList.add("active");
        setTimeout(() => {
            feedbackMissed.classList.remove("active");
            cb();
            processingAnswer = false;
        }, 1000);
    }
}

function wowFeedback() {
    if (question.correctness === 'right') {
        wowFeedbackRight(init);
    } else if (question.correctness === 'wrong') {
        wowFeedbackWrong(init);
    } else {
        wowFeedbackMissed(init);
    }
}

function storeQuestionAndSave() {
    appState.questions.push(question);
    if (timerToggle.checked) {
        PROGRESS_STORE.storeCompletedQuestion(question)
    }
    save();
}

function getPremiseCountForPoints(q) {
    try {
        if (Array.isArray(q?.premises)) return q.premises.length;
        if (typeof q?.premises === "number") return q.premises;
    } catch { }
    if (typeof savedata?.premises === "number") return savedata.premises;
    return 0;
}

function applyRankPointsForQuestion(q) {
    const current = (typeof appState.rankPoints === "number" && Number.isFinite(appState.rankPoints)) ? appState.rankPoints : 0;
    const rankIdx = getRankIndex(current);
    const requiredPremises = requiredPremisesForRankIndex(rankIdx);
    const premiseCount = getPremiseCountForPoints(q);
    if (premiseCount < requiredPremises) return;

    const startedAt = (typeof q?.startedAt === "number") ? q.startedAt : null;
    const answeredAt = (typeof q?.answeredAt === "number") ? q.answeredAt : Date.now();
    const elapsedSeconds = startedAt ? Math.max(0, (answeredAt - startedAt) / 1000) : 0;
    const delta = pointsMagnitude({
        premiseCount,
        elapsedSeconds,
        carouselEnabled: Boolean(savedata?.enableCarouselMode)
    });
    if (!delta) return;

    let next = current;
    if (q.correctness === "right") next += delta;
    else if (q.correctness === "wrong" || q.correctness === "missed") next -= delta;
    if (next < 0) next = 0;
    appState.rankPoints = next;
}

function checkIfTrue() {
    trueButton.blur();
    if (processingAnswer) {
        return;
    }
    processingAnswer = true;
    question.answerUser = true;
    if (question.isValid) {
        appState.score++;
        question.correctness = 'right';
    } else {
        appState.score--;
        question.correctness = 'wrong';
    }
    question.answeredAt = new Date().getTime();
    applyRankPointsForQuestion(question);
    storeQuestionAndSave();
    renderHQL(true);
    wowFeedback();
}

function checkIfFalse() {
    falseButton.blur();
    if (processingAnswer) {
        return;
    }
    processingAnswer = true;
    question.answerUser = false;
    if (!question.isValid) {
        appState.score++;
        question.correctness = 'right';
    } else {
        appState.score--;
        question.correctness = 'wrong';
    }
    question.answeredAt = new Date().getTime();
    applyRankPointsForQuestion(question);
    storeQuestionAndSave();
    renderHQL(true);
    wowFeedback();
}

function timeElapsed() {
    if (processingAnswer) {
        return;
    }
    processingAnswer = true;
    appState.score--;
    question.correctness = 'missed';
    question.answerUser = undefined;
    question.answeredAt = new Date().getTime();
    applyRankPointsForQuestion(question);
    storeQuestionAndSave();
    renderHQL(true);
    wowFeedback();
}

function resetApp() {
    const confirmed = confirm("Are you sure?");
    if (confirmed) {
        localStorage.removeItem(oldSettingsKey);
        localStorage.removeItem(imageKey);
        localStorage.removeItem(profilesKey);
        localStorage.removeItem(selectedProfileKey);
        localStorage.removeItem(appStateKey);
        document.getElementById("reset-app").innerText = 'Resetting...';
        deleteDatabase("SyllDB").then(() => {
            window.location.reload();
        });
    }
}

function clearHistory() {
    const confirmed = confirm("Are you sure? (does not remove progress graph history)");
    if (confirmed) {
        appState.questions = [];
        appState.score = 0;
        save();
        renderHQL();
    }
}

function deleteQuestion(i, isRight) {
    appState.score += (isRight ? -1 : 1);
    appState.questions.splice(i, 1);
    save();
    renderHQL();
}

function renderHQL(didAddSingleQuestion=false) {
    if (didAddSingleQuestion) {
        const index = appState.questions.length - 1;
        const recentQuestion = appState.questions[index];
        const firstChild = historyList.firstElementChild;
        historyList.insertBefore(createHQLI(recentQuestion, index), firstChild);
    } else {
        historyList.innerHTML = "";

        const len = appState.questions.length;
        const reverseChronological = appState.questions.slice().reverse();

        reverseChronological
            .map((q, i) => {
                const el = createHQLI(q, len - i - 1);
                return el;
            })
            .forEach(el => historyList.appendChild(el));
    }

    updateAverage(appState.questions);
    correctlyAnsweredEl.innerText = appState.score;
    nextLevelEl.innerText = appState.questions.length;
}

function updateAverage(reverseChronological) {
    let questions = reverseChronological.filter(q => q.answeredAt && q.startedAt);
    let times = questions.map(q => (q.answeredAt - q.startedAt) / 1000);
    if (times.length == 0) {
        return;
    }
    const totalTime = times.reduce((a,b) => a + b, 0);
    const minutes = Math.floor(totalTime / 60);
    const seconds = totalTime % 60;
    totalDisplay.innerHTML = minutes.toFixed(0) + 'm ' + seconds.toFixed(0) + 's';
    
    const average =  totalTime / times.length;
    averageDisplay.innerHTML = average.toFixed(1) + 's';

    const correctQuestions = questions.filter(q => q.correctness == 'right');
    const percentCorrect = 100 * correctQuestions.length / questions.length;
    percentCorrectDisplay.innerHTML = percentCorrect.toFixed(1) + '%';
    const correctTimes = correctQuestions.map(q => (q.answeredAt - q.startedAt) / 1000);
    if (correctTimes.length == 0) {
        averageCorrectDisplay.innerHTML = 'None yet';
        return;
    }
    const totalTimeBeingCorrect = correctTimes.reduce((a,b) => a + b, 0);
    const averageCorrect = totalTimeBeingCorrect / correctTimes.length;
    averageCorrectDisplay.innerHTML = averageCorrect.toFixed(1) + 's';
}

function createHQLI(question, i) {
    const q = renderJunkEmojis(question);
    const parent = document.createElement("DIV");

    const answerUser = q.answerUser;
    const answerUserClassName = {
        'missed': '',
        'right': answerUser,
        'wrong': answerUser,
    }[q.correctness];
    
    const answer = q.isValid;
    let classModifier = {
        'missed': '',
        'right': 'hqli--right',
        'wrong': 'hqli--wrong'
    }[q.correctness];
    
    let answerDisplay = ('' + answer).toUpperCase();
    let answerUserDisplay = {
        'missed': '(TIMED OUT)',
        'right': ('' + answerUser).toUpperCase(),
        'wrong': ('' + answerUser).toUpperCase()
    }[q.correctness];

    const htmlPremises = q.premises
        .map(p => `<div class="hqli-premise">${p}</div>`)
        .join("\n");

    const htmlOperations = q.operations ? q.operations.map(o => `<div class="hqli-operation">${o}</div>`).join("\n") : '';

    let responseTimeHtml = '';
    if (q.startedAt && q.answeredAt)
        responseTimeHtml =
`
        <div class="hqli-response-time">${Math.round((q.answeredAt - q.startedAt) / 1000)} sec</div>
`;
    
    const html =
`<div class="hqli ${classModifier}">
    <div class="inner">
        <div class="index"></div>
        <div class="hqli-premises">
            <div class="hqli-preamble">Premises</div>
            ${htmlPremises}
            ${htmlOperations ? '<div class="hqli-transform-header">Transformations</div>' : ''}
            ${htmlOperations}
        </div>
        <div class="hqli-postamble">Conclusion</div>
        <div class="hqli-conclusion">${q.conclusion}</div>
        <div class="hqli-answer-user ${answerUserClassName}">${answerUserDisplay}</div>
        <div class="hqli-answer ${answer}">${answerDisplay}</div>
        ${responseTimeHtml}
        <div class="hqli-footer">
            <div>${q.category}</div>
            ${createExplanationButton(q)}
            <button class="delete">X</button>
        </div>
    </div>
</div>`;
    parent.innerHTML = html;
    parent.querySelector(".index").textContent = i + 1;
    parent.querySelector(".delete").addEventListener('click', (e) => {
        e.stopPropagation();
        deleteQuestion(i, q.correctness === 'right');
    });
    const explanationButton = parent.querySelector(".explanation-button");
    if (explanationButton) {
        explanationButton.addEventListener('mouseenter', (e) => {
            createExplanationPopup(q, e);
        });
        explanationButton.addEventListener('mouseleave', () => {
            removeExplanationPopup();
        });
    }
    return parent.firstElementChild;
}

function toggleLegacyFolder() {
    appState.isLegacyOpen = !appState.isLegacyOpen;
    renderFolders();
    save();
}

function toggleExperimentalFolder() {
    appState.isExperimentalOpen = !appState.isExperimentalOpen;
    renderFolders();
    save();
}

function renderFolders() {
    renderFolder('legacy-folder-arrow', 'legacy-folder-content', appState.isLegacyOpen);
    renderFolder('experimental-folder-arrow', 'experimental-folder-content', appState.isExperimentalOpen);
}

function renderFolder(arrowId, contentId, isOpen) {
    const folderArrow = document.getElementById(arrowId);
    const folderContent = document.getElementById(contentId);
    if (isOpen) {
        folderContent.style.display = 'block';
        folderArrow.classList.add('open');
    } else {
        folderContent.style.display = 'none';
        folderArrow.classList.remove('open');
    }
}

// Events
timerInput.addEventListener("input", evt => {
    const el = evt.target;
    timerTime = el.value;
    timerCount = findStartingTimerCount();
    el.style.width = (el.value.length + 4) + 'ch';
    savedata.timer = el.value;
    if (timerToggle.checked) {
        stopCountDown();
        startCountDown();
    }
    save();
});

function handleCountDown() {
    const wasToggled = timerToggled;
    const wasRunning = timerRunning;
    timerToggled = timerToggle.checked;
    if (timerToggled) {
        startCountDown();
        return;
    }

    // Pausing the active question timer discards the current question and regenerates a fresh one
    // to prevent pausing mid-question for advantage.
    stopCountDown();
    if (wasToggled && wasRunning && question) {
        init();
    } else {
        renderTimerBar();
    }
}

timerToggle.addEventListener("click", evt => {
    handleCountDown();
});

let dehoverQueue = [];
function handleKeyPress(event) {
    const tagName = event.target.tagName.toLowerCase();
    const isEditable = event.target.isContentEditable;
    if (tagName === "button" || tagName === "input" || tagName === "textarea" || isEditable) {
        return;
    }
    switch (event.code) {
        case "KeyH":
            historyCheckbox.checked = !historyCheckbox.checked;
            if (historyCheckbox.checked) {
                const firstEntry = historyList.firstElementChild;
                if (firstEntry) {
                    const explanationButton = firstEntry.querySelector(`button.explanation-button`);
                    if (explanationButton) {
                        explanationButton.dispatchEvent(new Event("mouseenter"));
                        dehoverQueue.push(() => {
                            explanationButton.dispatchEvent(new Event("mouseleave"));
                        });
                    }
                }
            } else {
                dehoverQueue.forEach(callback => {
                    callback();
                });
            }
            break;
        case "KeyA":
            if (savedata.enableCarouselMode) {
                carouselBackButton.click();
            }
            break;
        case "KeyD":
            if (savedata.enableCarouselMode) {
                carouselNextButton.click();
            }
            break;
        case "KeyJ":
        case "Digit1":
        case "ArrowLeft":
            checkIfTrue();
            break;
        case "KeyK":
        case "Digit2":
        case "ArrowRight":
            checkIfFalse();
            break;
        case "Space":
            timerToggle.checked = !timerToggle.checked;
            handleCountDown();
            break;
        default:
            break;
    }
}

document.addEventListener("keydown", handleKeyPress);

registerEventHandlers();
load();
init();

// Expose legacy inline HTML handlers (onchange/onclick/oninput) as globals.
// In the original <script> build these were global; in module bundling they are not.
(globalThis).handleImageChange = handleImageChange;
(globalThis).clearBackgroundImage = clearBackgroundImage;
(globalThis).handleColorChange = handleColorChange;
(globalThis).handleDarkModeChange = handleDarkModeChange;
(globalThis).handleSfxChange = handleSfxChange;
(globalThis).handleFastUiChange = handleFastUiChange;
(globalThis).toggleExperimentalFolder = toggleExperimentalFolder;
(globalThis).toggleLegacyFolder = toggleLegacyFolder;
(globalThis).resetApp = resetApp;
(globalThis).clearHistory = clearHistory;
(globalThis).checkIfTrue = checkIfTrue;
(globalThis).checkIfFalse = checkIfFalse;

