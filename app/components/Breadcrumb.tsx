'use client'

interface BreadcrumbProps {
  items: Array<{
    label: string
    icon?: string
  }>
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '12px 20px',
      backgroundColor: 'rgba(20, 20, 20, 0.8)',
      backdropFilter: 'blur(10px)',
      borderRadius: '12px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      fontSize: '14px',
      fontWeight: '500',
      color: '#bbb',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
      animation: 'slideDown 0.3s ease-out'
    }}>
      {items.map((item, index) => (
        <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {index > 0 && (
            <span style={{ color: '#666', fontSize: '12px' }}>›</span>
          )}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            color: index === items.length - 1 ? '#fff' : '#999',
            fontWeight: index === items.length - 1 ? 'bold' : 'normal'
          }}>
            {item.icon && <span style={{ fontSize: '16px' }}>{item.icon}</span>}
            <span>{item.label}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
