# StartupCard Component

A reusable React component for displaying startup information in a card format, based on the Figma design specifications.

## Features

- **Modern Design**: Clean, professional card layout with rounded corners and subtle shadows
- **Image Overlay**: Gradient overlay with floating action buttons and badges
- **Investment Details**: Comprehensive display of NFT pricing, returns, and funding progress
- **Interactive Elements**: Like button, category badges, and dual action buttons
- **Customizable**: Multiple visibility options and custom event handlers
- **Responsive**: Works across different screen sizes
- **Error Handling**: Graceful fallback for missing or broken images

## Usage

### Basic Usage

```tsx
import { StartupCard } from '@/components/startup/StartupCard';

<StartupCard
  id='1'
  image='/path/to/image.jpg'
  title='Startup Name'
  nftPrice='$75 ckUSDC'
  periodicReturn='$12'
  fundedText='45% Funded'
  fundedPct={0.45}
  totalFunded={22500}
  fundingGoal={50000}
/>;
```

### Advanced Usage with All Options

```tsx
<StartupCard
  id='2'
  image='/path/to/image.jpg'
  title='TechInnovate'
  description='Revolutionary technology solutions for sustainable agriculture.'
  category='Technology'
  riskLevel='Low Risk'
  location='San Francisco, CA'
  employees='25 employees'
  logo='/path/to/logo.png'
  nftPrice='$150 ckUSDC'
  periodicReturn='$25'
  annualROI='18.5%'
  availability='89 NFT'
  fundedText='78% Funded'
  fundedPct={0.78}
  totalFunded={78000}
  fundingGoal={100000}
  onViewDetails={id => console.log('View details:', id)}
  onInvest={id => console.log('Invest:', id)}
/>
```

## Props

### Required Props

| Prop             | Type               | Description                       |
| ---------------- | ------------------ | --------------------------------- |
| `id`             | `string \| number` | Unique identifier for the startup |
| `image`          | `string`           | URL of the startup's main image   |
| `title`          | `string`           | Name of the startup               |
| `nftPrice`       | `string`           | NFT price with currency           |
| `periodicReturn` | `string`           | Periodic return amount            |
| `fundedText`     | `string`           | Funding progress text             |

### Optional Props

| Prop            | Type                             | Default     | Description                                    |
| --------------- | -------------------------------- | ----------- | ---------------------------------------------- |
| `description`   | `string`                         | -           | Startup description                            |
| `category`      | `string`                         | -           | Startup category/sector                        |
| `riskLevel`     | `string`                         | -           | Risk level (e.g., "Low Risk", "Moderate Risk") |
| `location`      | `string`                         | -           | Company location                               |
| `employees`     | `string`                         | -           | Number of employees                            |
| `logo`          | `string`                         | -           | Company logo URL                               |
| `annualROI`     | `string`                         | -           | Annual return on investment                    |
| `availability`  | `string`                         | -           | Available NFT count                            |
| `fundedPct`     | `number`                         | `0.45`      | Funding percentage (0-1)                       |
| `fundedColor`   | `string`                         | `'#22c55e'` | Progress bar color                             |
| `totalFunded`   | `number`                         | -           | Total amount funded                            |
| `fundingGoal`   | `number`                         | -           | Funding goal amount                            |
| `onViewDetails` | `(id: string \| number) => void` | -           | Custom view details handler                    |
| `onInvest`      | `(id: string \| number) => void` | -           | Custom invest handler                          |

### Visibility Props

| Prop               | Type      | Default | Description             |
| ------------------ | --------- | ------- | ----------------------- |
| `showLikeButton`   | `boolean` | `true`  | Show/hide like button   |
| `showLocation`     | `boolean` | `true`  | Show/hide location info |
| `showDescription`  | `boolean` | `true`  | Show/hide description   |
| `showAnnualROI`    | `boolean` | `true`  | Show/hide annual ROI    |
| `showAvailability` | `boolean` | `true`  | Show/hide availability  |

## Styling

The component uses Tailwind CSS classes and follows the design system:

- **Colors**: Neutral grays, purple accents (#7a5af8), warning oranges (#fe9900)
- **Typography**: IBM Plex Serif for titles, clean sans-serif for details
- **Spacing**: Consistent padding and margins following 8px grid
- **Borders**: Subtle borders with rounded corners
- **Shadows**: Hover effects with shadow transitions

## Examples

See `StartupCard.example.tsx` for comprehensive usage examples including:

- Basic usage
- Full featured card
- Customized visibility options
- Custom event handlers

## Integration

The component is exported from the main components index:

```tsx
import { StartupCard, StartupCardProps } from '@/components';
```

## Design System

The component follows the Figma design specifications with:

- **Image Section**: 230px height with overlay elements
- **Content Section**: Structured layout with investment details
- **Progress Bar**: Visual funding progress with color coding
- **Action Buttons**: Dual-button layout with distinct styling
- **Icons**: Custom SVG icons for all elements
