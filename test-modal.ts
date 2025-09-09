// Test file to verify the ModalOptions interface works correctly
import { createBsModal } from './src/utils/dom-utils';

// Test 1: Basic usage with title and content
createBsModal({
    title: 'Test Modal',
    content: 'This is a test'
});

// Test 2: With custom buttons
createBsModal({
    title: 'Test Modal with Buttons',
    content: 'This is a test with buttons',
    buttons: [
        { label: 'OK', className: 'btn btn-primary', value: 'ok' },
        { label: 'Cancel', className: 'btn btn-secondary', value: 'cancel' }
    ]
});

// Test 3: With timeout
createBsModal({
    title: 'Test Modal with Timeout',
    content: 'This modal will timeout',
    timeoutDelay: 10
});

// Test 4: HTML Element content
const div = document.createElement('div');
div.innerHTML = '<p>HTML Content</p>';
createBsModal({
    title: 'HTML Content Modal',
    content: div
});

console.log('All modal tests passed!');
