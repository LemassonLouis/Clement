import { createWriteStream } from "fs";
import { execSync } from "child_process";
import conventionalChangelog from "conventional-changelog";

const currentTag = process.env.GITHUB_REF_NAME;

if (!currentTag) {
  console.error("❌  GITHUB_REF_NAME is not defined.");
  process.exit(1);
}

const getTagPrefix = (tag) => {
  if (tag.startsWith("beta-")) return "beta-";
  if (tag.startsWith("prerelease-")) return "prerelease-";
  if (tag.startsWith("v")) return "v";
  return null;
};

const prefix = getTagPrefix(currentTag);

if (!prefix) {
  console.error(`❌  Unsupported tag prefix for: "${currentTag}"`);
  process.exit(1);
}

const getTagsWithPrefix = (prefix) => {
  return execSync("git tag --sort=-creatordate")
    .toString()
    .split("\n")
    .filter(tag => tag.startsWith(prefix));
};

const tags = getTagsWithPrefix(prefix);
const previousTagIndex = tags.indexOf(currentTag) + 1;
const previousTag = tags[previousTagIndex] || null;

console.log(`ℹ️  Generating changelog from ${previousTag || 'the beginning'} to ${currentTag}`);

const changelogStream = createWriteStream("CHANGELOG.md");

conventionalChangelog(
  {
    preset: "conventionalcommits",
    releaseCount: 0
  },
  {
    version: currentTag
  },
  {
    from: previousTag,
    to: currentTag
  },
  null,
  {
    transform: (commit, context) => {
      const typesToKeep = ['feat', 'fix', 'docs', 'style', 'refactor', 'perf', 'test', 'ci', 'chore'];

      if (!typesToKeep.includes(commit.type)) {
        return null;
      }

      return {
        ...commit
      };
    }
  }
).pipe(changelogStream);
