# Image Compressor

A fast, secure, and privacy-focused image compression web application built with Next.js. Compress images directly in your browser without uploading to any server.

## Features

### Core Compression Options
- **Quality Control**: Adjust compression quality from 0-100% for fine-tuned control
- **Preset Levels**: Quick presets (Low, Medium, High) for common compression scenarios
- **Multiple Format Support**: Convert between JPEG, PNG, WebP, GIF, BMP, and TIFF formats
- **Image Resizing**: Resize images with optional aspect ratio preservation
- **Real-time Preview**: See before/after previews with compression statistics

### User Experience
- **Drag & Drop Upload**: Intuitive drag-and-drop or click-to-browse interface
- **Browser-based Processing**: Complete client-side compression - no server uploads
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Live Statistics**: Real-time compression ratio, file size savings, and image dimensions
- **One-Click Download**: Easily download compressed images with automatic naming

### Privacy & Performance
- **Complete Privacy**: All image processing happens locally in your browser
- **No Server Storage**: Images never leave your device
- **Fast Processing**: Instant compression without server latency
- **No Registration**: Use immediately without creating an account

## Technology Stack

- **Framework**: Next.js 16 with TypeScript
- **Styling**: Tailwind CSS v4 with semantic design tokens
- **UI Components**: shadcn/ui
- **Image Processing**: Native Canvas API
- **Icon Library**: Lucide React

## How to Use

### Basic Compression
1. **Upload an Image**: Drag and drop or click to browse for an image file
2. **Configure Settings**:
   - Choose a preset level or adjust quality manually
   - Select output format
   - Optionally resize the image
3. **Compress**: Click the "Compress Image" button
4. **Download**: Click "Download Compressed Image" to save the result

### Compression Settings

#### Quality Slider (0-100%)
- **90-100%**: Minimal compression, highest quality (larger files)
- **70-90%**: Balanced compression (recommended for most use cases)
- **50-70%**: Aggressive compression, noticeable quality loss (smaller files)
- **0-50%**: Extreme compression, significant quality loss (minimal files)

#### Format Selection
- **JPEG**: Best for photographs and complex images
- **PNG**: Best for images with transparency
- **WebP**: Modern format with excellent compression
- **GIF**: For simple graphics and animations
- **BMP/TIFF**: For specific use cases

#### Resize Options
- Optional width and height adjustment
- Toggle aspect ratio preservation
- Automatically calculates missing dimensions when aspect ratio is enabled

## File Structure

```
components/
├── ImageCompressor.tsx          # Main application component
└── ui/
    └── button.tsx               # Button component

lib/
├── imageCompression.ts          # Compression utilities and functions
└── utils.ts                     # Utility functions

app/
├── layout.tsx                   # Root layout with metadata
├── globals.css                  # Tailwind CSS with design tokens
└── page.tsx                     # Home page

public/
└── test-image.png               # Sample test image
```

## API Reference

### compressImage Function

```typescript
async function compressImage(
  file: File,
  options: CompressionOptions
): Promise<CompressionResult>
```

**Parameters:**
- `file`: The image file to compress
- `options`: Compression configuration object

**Returns:** Promise containing compression result with statistics

### CompressionOptions Interface

```typescript
interface CompressionOptions {
  quality: number;                    // 0-100
  format: 'jpeg' | 'png' | 'webp' | 'gif' | 'bmp' | 'tiff';
  width?: number;                     // Optional width in pixels
  height?: number;                    // Optional height in pixels
  maintainAspectRatio?: boolean;      // Preserve aspect ratio
}
```

### CompressionResult Interface

```typescript
interface CompressionResult {
  data: Blob;                         // Compressed image blob
  mimeType: string;                   // Output MIME type
  width: number;                      // Final image width
  height: number;                     // Final image height
  originalSize: number;               // Original file size in bytes
  compressedSize: number;             // Compressed file size in bytes
  compressionRatio: number;           // Percentage saved
}
```

## Supported Image Formats

### Input Formats
All common web image formats are supported:
- JPEG/JPG
- PNG
- WebP
- GIF (static)
- BMP
- TIFF
- SVG
- And more...

### Output Formats
- JPEG
- PNG
- WebP
- GIF
- BMP
- TIFF

## Performance Considerations

### Browser Compatibility
- Works on all modern browsers (Chrome, Firefox, Safari, Edge)
- Requires HTML5 Canvas support
- Best performance on recent browser versions

### File Size Limits
- No hard limit, but very large files (>100MB) may cause browser memory issues
- Recommended maximum: 50MB for optimal performance

### Processing Speed
- Small images (<5MB): Instant (< 100ms)
- Medium images (5-20MB): Fast (< 500ms)
- Large images (20-50MB): May take 1-2 seconds

## Browser Requirements

- HTML5 Canvas API
- FileReader API
- Blob API
- Modern CSS Grid and Flexbox support

## Development

### Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

### Environment Variables
No environment variables required - the app works entirely client-side.

## Deployment

Deploy to Vercel with one click:
1. Push your repository to GitHub
2. Import in Vercel dashboard
3. Deploy - no additional configuration needed

The app is production-ready and requires no backend infrastructure.

## License

MIT

## Privacy Policy

This application:
- ✅ Never uploads images to any server
- ✅ Never stores any user data
- ✅ Doesn't use cookies or tracking
- ✅ Processes everything locally in your browser
- ✅ Is completely open-source and auditable

## Support

For issues, feature requests, or questions, please open an issue on GitHub.
