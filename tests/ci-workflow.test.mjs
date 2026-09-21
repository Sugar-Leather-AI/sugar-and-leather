// @vitest-environment node

import { access, readFile } from 'node:fs/promises';
import { constants } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const packagePath = fileURLToPath(new URL('../package.json', import.meta.url));
const typecheckConfigPath = fileURLToPath(new URL('../tsconfig.json', import.meta.url));
const ciWorkflowPath = fileURLToPath(new URL('../.github/workflows/ci.yml', import.meta.url));
const deployWorkflowPath = fileURLToPath(
  new URL('../.github/workflows/deploy.yml', import.meta.url),
);

const read = (path) => readFile(path, 'utf8');

async function exists(path) {
  try {
    await access(path, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

describe('repository verification contract', () => {
  it('does not run GitHub Actions CI or Docker deploy workflows right now', async () => {
    expect({
      ciWorkflow: await exists(ciWorkflowPath),
      deployWorkflow: await exists(deployWorkflowPath),
    }).toEqual({
      ciWorkflow: false,
      deployWorkflow: false,
    });
  });

  it('keeps lint, type, test, and production-build gates in the local source of truth', async () => {
    const packageJson = JSON.parse(await read(packagePath));

    expect(packageJson.engines).toEqual({ node: '>=24 <25' });
    expect(packageJson.scripts).toMatchObject({
      lint: 'eslint . --max-warnings=0',
      test: 'vitest run',
      typecheck: 'node scripts/typecheck-baseline.mjs',
      verify: 'npm run lint && npm run typecheck && npm test && npm run build',
    });

    const typecheckConfig = JSON.parse(await read(typecheckConfigPath));
    expect(typecheckConfig.compilerOptions).toMatchObject({
      allowJs: true,
      checkJs: true,
      strict: true,
    });
    expect(typecheckConfig.include).toContain('src');
  });
});
