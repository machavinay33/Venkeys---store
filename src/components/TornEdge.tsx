interface TornEdgeProps {
  fill?: string
  flip?: boolean
  className?: string
}

/**
 * A torn-paper edge, evoking the act of tearing open a spice pouch.
 * Used once as the seam between the hero and the page body.
 */
export default function TornEdge({ fill = '#F6EFE2', flip = false, className = '' }: TornEdgeProps) {
  return (
    <div className={`torn-edge ${flip ? 'rotate-180' : ''} ${className}`} aria-hidden="true">
      <svg viewBox="0 0 1200 28" preserveAspectRatio="none">
        <path
          d="M0,6 L24,12 L48,3 L74,15 L100,5 L128,16 L154,4 L182,13 L210,2 L238,17 L266,6 L294,14 L322,3 L350,16 L378,5 L406,12 L434,2 L462,15 L490,6 L518,17 L546,4 L574,13 L602,3 L630,16 L658,6 L686,14 L714,2 L742,17 L770,5 L798,12 L826,3 L854,15 L882,6 L910,16 L938,4 L966,13 L994,2 L1022,17 L1050,6 L1078,14 L1106,3 L1134,16 L1162,5 L1200,12 L1200,28 L0,28 Z"
          fill={fill}
        />
      </svg>
    </div>
  )
}
