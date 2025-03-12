import { Member } from '@/components/DefaultStructure';

export function CreateOtherNameMap(item: Member) {
  return item.otherName
    .match(/\([^()]+\)/g)
    ?.flatMap((match) => match.split(','))
    .flatMap((match) => match.slice(1, -1))
    .map((match) => match.replace(/\s+/g, ''));
}

export default function CreateNameQuery(item: Member) {
  const reversedEnglishName = item.englishName.split(/\s+/).reverse().join('');

  const otherNames = item.otherName && ',' + CreateOtherNameMap(item)?.join(',');

  return `${item.name.replace(/\s+/g, '')},${item.englishName.replace(/\s+/g, '')},${reversedEnglishName}${otherNames}`;
}
