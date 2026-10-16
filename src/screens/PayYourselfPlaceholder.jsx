import { AppBar, Card } from "../novakit";

/**
 * A labelled placeholder for a step the prototype doesn't build, like S3's terms placeholder
 * before S4 existed. Nothing happens on it. The defaults are paying some or all of the
 * advance yourself (my Assumption: pay part manually, stubbed), opened from the details
 * view. S2 reuses it for "Start verification", with its own wording.
 * (The file keeps its first name; it now serves both placeholders.)
 */
export default function PayYourselfPlaceholder({
  Frame,
  onBack,
  title = "Pay it yourself",
  backLabel = "Back to your advance",
  heading = "Placeholder: pay some or all yourself",
  line = "This screen isn't built yet. Nothing has been paid.",
}) {
  return (
    <Frame title={`${title}: NovaPay`} appBar={<AppBar title={title} onBack={onBack} backLabel={backLabel} />}>
      <Card className="space-y-1">
        <p className="text-body font-semibold text-neutral-900">{heading}</p>
        <p className="text-body text-neutral-700">{line}</p>
      </Card>
    </Frame>
  );
}
