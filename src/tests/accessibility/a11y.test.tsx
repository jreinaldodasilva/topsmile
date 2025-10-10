// src/tests/accessibility/a11y.test.tsx
import React from 'react';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import Button from '../../components/UI/Button/Button';
import Input from '../../components/UI/Input/Input';
import Modal from '../../components/UI/Modal/Modal';
import { Dropdown } from '../../components/common/Dropdown/Dropdown';

expect.extend(toHaveNoViolations);

describe('Accessibility Audit', () => {
    it('Button has no accessibility violations', async () => {
        const { container } = render(<Button>Click Me</Button>);
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });

    it('Input has no accessibility violations', async () => {
        const { container } = render(<Input label="Email" type="email" />);
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });

    it('Modal has no accessibility violations', async () => {
        const { container } = render(
            <Modal isOpen={true} onClose={() => {}} title="Test Modal">
                <p>Modal content</p>
            </Modal>
        );
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });

    it('Dropdown has no accessibility violations', async () => {
        const { container } = render(
            <Dropdown
                trigger={<span>Menu</span>}
                items={[
                    { label: 'Item 1', onClick: () => {} },
                    { label: 'Item 2', onClick: () => {} }
                ]}
            />
        );
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });

    it('Form with multiple inputs has no violations', async () => {
        const { container } = render(
            <form>
                <Input label="Name" required />
                <Input label="Email" type="email" required />
                <Button type="submit">Submit</Button>
            </form>
        );
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });
});
