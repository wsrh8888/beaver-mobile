 # 🤝 Contributing to Beaver Mobile

Thank you for your interest in contributing to Beaver Mobile! This document provides guidelines and information for contributors.

## 📋 Table of Contents

- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Reporting Bugs](#reporting-bugs)
- [Feature Requests](#feature-requests)

## 🎯 How Can I Contribute?

### 🐛 Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates.

**Bug Report Template:**

```markdown
## Bug Description
Brief description of the bug

## Steps to Reproduce
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

## Expected Behavior
What you expected to happen

## Actual Behavior
What actually happened

## Environment
- OS: [e.g. Windows 10, macOS 12.0]
- Node Version: [e.g. 20.0.0]
- UniApp Version: [e.g. 3.0.0]

## Additional Information
Any additional context, logs, or screenshots
```

### 💡 Suggesting Enhancements

**Feature Request Template:**

```markdown
## Problem Statement
Clear description of the problem this feature would solve

## Proposed Solution
Description of the proposed solution

## Alternative Solutions
Any alternative solutions you've considered

## Additional Context
Any other context, screenshots, or examples
```

### 🔧 Code Contributions

We welcome code contributions! Here's how to get started:

1. **Fork** the repository
2. **Create** a feature branch
3. **Make** your changes
4. **Test** your changes
5. **Submit** a pull request

## 🛠️ Development Setup

### Prerequisites

- Node.js >= 20.0.0
- UniApp Development Tools
- Git

### Local Development

1. **Clone your fork**
```bash
git clone https://github.com/YOUR_USERNAME/beaver-mobile.git
cd beaver-mobile
```

2. **Add upstream remote**
```bash
git remote add upstream https://github.com/wsrh8888/beaver-mobile.git
```

3. **Install dependencies**
```bash
npm install
```

4. **Build project**
```bash
npm run build_test
```

5. **Import to UniApp client for testing**

## 📝 Coding Standards

### Vue 3 Code Style

- Use Composition API
- Follow Vue 3 best practices
- Use TypeScript for type safety
- Use Pinia for state management

### Project Structure

```
src/
├── api/              # API interfaces
├── component/        # Shared components
├── pages/           # Page components
├── pinia/           # State management
├── static/          # Static resources
├── types/           # TypeScript types
├── utils/           # Utility functions
└── ws-manager/      # WebSocket management
```

### Component Guidelines

- Use PascalCase for component names
- Use camelCase for props and events
- Keep components focused and reusable
- Add proper TypeScript types

### Error Handling

- Always handle API errors gracefully
- Provide meaningful error messages
- Log errors appropriately
- Use try-catch blocks where necessary

### Testing

- Test components in different scenarios
- Verify API integrations
- Test on different devices/screens
- Ensure responsive design works

## 📝 Commit Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Commit Message Format

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to the build process or auxiliary tools

### Examples

```bash
feat(chat): add emoji picker functionality
fix(auth): resolve login validation issue
docs: update README with new features
refactor(ui): simplify component structure
test(api): add integration tests for chat endpoints
```

## 🔄 Pull Request Process

### Before Submitting

1. **Update your branch**
```bash
git fetch upstream
git rebase upstream/main
```

2. **Run tests**
```bash
npm run build_test
```

3. **Check formatting**
```bash
# Ensure code follows project standards
```

### Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Manual testing completed
- [ ] Cross-platform testing completed

## Checklist
- [ ] My code follows the style guidelines of this project
- [ ] I have performed a self-review of my own code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have tested my changes on multiple devices
```

### Review Process

1. **Automated Checks**
   - Build process runs successfully
   - Code follows project standards
   - No TypeScript errors

2. **Code Review**
   - At least one maintainer must approve
   - Address all review comments
   - Update documentation if needed

3. **Merge**
   - Squash commits if requested
   - Use conventional commit message
   - Delete feature branch after merge

## 📚 Documentation

### Code Documentation

- Document complex functions and components
- Use clear and concise comments
- Include examples for reusable components

### API Documentation

- Update API documentation for new endpoints
- Include request/response examples
- Document error handling

### README Updates

- Update README.md for new features
- Add installation instructions for new dependencies
- Update configuration examples

## 🏷️ Release Process

### Versioning

We follow [Semantic Versioning](https://semver.org/):

- `MAJOR.MINOR.PATCH`
- `MAJOR`: Breaking changes
- `MINOR`: New features (backward compatible)
- `PATCH`: Bug fixes (backward compatible)

### Release Checklist

- [ ] All tests pass
- [ ] Documentation is updated
- [ ] Changelog is updated
- [ ] Version is bumped
- [ ] Release notes are written

## 🆘 Getting Help

- **Issues**: [GitHub Issues](https://github.com/wsrh8888/beaver-mobile/issues)
- **Email**: [751135385@qq.com](mailto:751135385@qq.com)
- **QQ Group**: [1013328597](https://qm.qq.com/q/82rbf7QBzO)

## 🙏 Recognition

Contributors will be recognized in:

- Project README.md
- Release notes
- Contributor hall of fame
- GitHub contributors page

---

Thank you for contributing to Beaver Mobile! 🦫