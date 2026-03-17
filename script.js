function analyze() {

let job = document.getElementById("jobDesc").value.toLowerCase()

let userSkills = document.getElementById("skills").value.toLowerCase().split(",")
userSkills = userSkills.map(s => s.trim())

let techList = [
"javascript","python","java","node","react","docker","aws",
"kubernetes","sql","mongodb","git","linux","ci/cd"
]

// Extract required skills
let required = techList.filter(skill => job.includes(skill))

// Find matches & missing
let matched = required.filter(skill => userSkills.includes(skill))
let missing = required.filter(skill => !userSkills.includes(skill))

// Score
let score = required.length === 0 ? 0 :
Math.round((matched.length / required.length) * 100)

// Generate tags
let matchedTags = matched.map(s => `<span class="tag green">${s}</span>`).join("")
let missingTags = missing.map(s => `<span class="tag red">${s}</span>`).join("")

// Smart suggestions
let suggestions = []

if(missing.includes("docker")) {
    suggestions.push("Build a Dockerized project")
}
if(missing.includes("aws")) {
    suggestions.push("Deploy a project on AWS")
}
if(missing.includes("ci/cd")) {
    suggestions.push("Create a CI/CD pipeline using GitHub Actions")
}
if(missing.length === 0){
    suggestions.push("You're job ready 🚀")
}

// Render UI
document.getElementById("resultBox").innerHTML = `
<h3>Match Score: ${score}%</h3>

<div class="scoreBar">
    <div class="scoreFill" style="width:${score}%"></div>
</div>

<h4>Matched Skills</h4>
${matchedTags || "None"}

<h4>Missing Skills</h4>
${missingTags || "None"}

<h4>Suggestions</h4>
<ul>
${suggestions.map(s => `<li>${s}</li>`).join("")}
</ul>
`

}
async function analyzeGitHub() {

let username = document.getElementById("username").value

let res = await fetch(`https://api.github.com/users/${username}/repos`)
let data = await res.json()

if(!data || data.length === 0){
document.getElementById("githubResult").innerHTML = "No repos found"
return
}

// Repo count
let repoCount = data.length

// Languages count
let langMap = {}

data.forEach(repo => {
if(repo.language){
langMap[repo.language] = (langMap[repo.language] || 0) + 1
}
})

// Top languages
let topLangs = Object.keys(langMap)
.sort((a,b)=>langMap[b]-langMap[a])
.slice(0,3)

// Score logic
let score = Math.min(100, repoCount * 5)

// Suggestions
let suggestions = []

if(repoCount < 5){
suggestions.push("Create more projects (at least 5)")
}
if(topLangs.length < 2){
suggestions.push("Use multiple technologies")
}
if(repoCount >= 10){
suggestions.push("Good project count 👍")
}

// Render
document.getElementById("githubResult").innerHTML = `
<h3>GitHub Score: ${score}/100</h3>

<div class="scoreBar">
    <div class="scoreFill" style="width:${score}%"></div>
</div>

<p><strong>Total Repositories:</strong> ${repoCount}</p>

<p><strong>Top Languages:</strong> ${topLangs.join(", ")}</p>

<h4>Suggestions</h4>
<ul>
${suggestions.map(s => `<li>${s}</li>`).join("")}
</ul>
`

}
function analyzeResume(){

let text = document.getElementById("resumeText").value.toLowerCase()

if(!text){
document.getElementById("resumeResult").innerHTML = "Please paste your resume"
return
}

// Important keywords
let keywords = [
"javascript","python","java","react","node","sql",
"aws","docker","kubernetes","git","linux"
]

// Count matches
let matched = keywords.filter(k => text.includes(k))

// Sections check
let sections = {
"projects": text.includes("project"),
"education": text.includes("education"),
"skills": text.includes("skill"),
"experience": text.includes("experience")
}

let missingSections = Object.keys(sections).filter(s => !sections[s])

// Score logic
let score = Math.min(100, (matched.length * 7) + (4 - missingSections.length)*10)

// Suggestions
let suggestions = []

if(matched.length < 5){
suggestions.push("Add more technical skills")
}

if(missingSections.length > 0){
suggestions.push("Include sections: " + missingSections.join(", "))
}

if(!text.includes("project")){
suggestions.push("Add project descriptions with impact")
}

if(!text.includes("developed")){
suggestions.push("Use action words like 'Developed', 'Built'")
}

// Render
document.getElementById("resumeResult").innerHTML = `
<h3>ATS Score: ${score}/100</h3>

<div class="scoreBar">
    <div class="scoreFill" style="width:${score}%"></div>
</div>

<p><strong>Matched Skills:</strong> ${matched.join(", ")}</p>

<p><strong>Missing Sections:</strong> ${missingSections.join(", ") || "None"}</p>

<h4>Suggestions</h4>
<ul>
${suggestions.map(s => `<li>${s}</li>`).join("")}
</ul>
`

}