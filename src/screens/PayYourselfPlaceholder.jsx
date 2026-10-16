import { AppBar, Card } from "../novakit";

/**
 * Placeholder for paying some or all of the advance yourself, opened from the details view's
 * status section. My Assumption: the user can pay part manually, stubbed in the prototype.
 * Labelled as a placeholder, like S3's terms placeholder before S4 existed. Nothing is paid.
 */
export default function PayYourselfPlaceholder({ Frame, onBack }) {
  return (
    <Frame
      title="Pay it yourself: NovaPay"
      appBar={<AppBar title="Pay it yourself" onBack={onBack} backLabel="Back to your advance" />}
    >
      <Card className="space-y-1">
        <p className="text-body font-semibold text-neutral-900">Placeholder: pay some or all yourself</p>
        <p className="text-body text-neutral-700">This screen isn't built yet. Nothing has been paid.</p>
      </Card>
    </Frame>
  );
}
