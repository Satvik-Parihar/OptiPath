import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from '../App';

// Mock dependencies
vi.mock('react-cytoscapejs', () => ({
    default: () => <div data-testid="graph-canvas">Graph Canvas</div>
}));

vi.mock('../components/ImageUploader', () => ({
    default: ({ onUploadSuccess }) => (
        <button onClick={() => onUploadSuccess([{ data: { id: '1', label: '1' } }])}>
            Mock Upload
        </button>
    )
}));

vi.mock('axios');

describe('App Component', () => {
    it('renders the main application header', () => {
        // Basic Render
        render(<App />);

        // Check for title
        expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/AlgoPath/i);
        expect(screen.getByText(/Algorithm Visualizer/i)).toBeInTheDocument();
    });

    it('renders the visualizer view by default', () => {
        render(<App />);
        expect(screen.getByText(/Editor/i).closest('button')).toHaveClass('active');
    });

    it('switches views when navigation buttons are clicked', () => {
        render(<App />);

        const theoryBtn = screen.getByText(/Theory/i).closest('button');
        const editorBtn = screen.getByText(/Editor/i).closest('button');

        fireEvent.click(theoryBtn);
        expect(theoryBtn).toHaveClass('active');
        expect(editorBtn).not.toHaveClass('active');
    });

    it('simulates node upload', async () => {
        render(<App />);
        const uploadBtn = screen.getByText('Mock Upload');
        fireEvent.click(uploadBtn);

        // After upload, the select dropdown should contain the new node
        await waitFor(() => {
            expect(screen.getByText('Node 1')).toBeInTheDocument();
        });
    });
});
