const {
  Link,
  Line,
  List,
  TitleSection,
  Section,
  SubSection,
  Container,
} = require('../dist/lib')

const Header = (data) => {
  const list = List([
    Link(data.phone, `tel:${data.phone}`),
    Link(data.email, `mailto:${data.email}`),
    Link(data.website, `https://${data.website}`),
    Link(data.github, `https://${data.github}`),
  ])

  return TitleSection(data.name, [list])
}

const buildEducationDate = (date) =>
  date.expectedGraduation
    ? `Expected graduation: ${date.expectedGraduation}`
    : `${date.start}—${date.end}`

const buildEducationItem = (item) =>
  SubSection(`${item.degree}, *minor in ${item.minor}*`, [
    Line(`${item.school} \\`),
    Line(`${item.location} \\`),
    Line(`${buildEducationDate(item.date)}`),
  ])

const Education = (data) => Section('Education', data.map(buildEducationItem))

const buildExperienceItem = (item) => {
  const links = item.url
    ? List([
        Link(item.url.display, item.url.href),
        Link(item.repo.display, item.repo.href),
      ])
    : List([Link(item.repo.display, item.repo.href)])

  return SubSection(item.title, [
    Line('Links:'),
    links,
    Line(`Stack: ${item.stack.join(', ')}`),
    Line(''),
    Line('Summary:'),
    List(item.summary),
  ])
}

const TechnicalExperience = (data) =>
  Section('Technical Experience', data.map(buildExperienceItem))

const generateResumeText = (data) =>
  Container([
    Header(data.header),
    Education(data.education),
    TechnicalExperience(data.experience),
  ]).compose()

module.exports = {
  default: generateResumeText,
  Header,
  Education,
  TechnicalExperience,
  buildExperienceItem,
}
