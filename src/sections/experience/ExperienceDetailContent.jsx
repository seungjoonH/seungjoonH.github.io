import { useA11y } from '../../hooks/useA11y';
import { Icon } from '@components/shared/icon/Icon';
import { renderRichText, renderLinkTitle } from '@sections/projects/utils/richText';
import { getLinkTypeLabel } from '@sections/projects/utils/linkLabels';
import { formatExperienceDateFull } from '../../utils/dateFormat';
import { buildCls } from '../../utils/cssUtil';
import cardStyles from '@sections/projects/projectCard.module.css';

export function ExperienceDetailContent({ experience }) {
  const a11y = useA11y();
  const sections = experience.sections ?? [];
  const topLinks = experience.links ?? [];
  const imageUrl = experience.getImageUrl();

  const handleOpenExternal = (href) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(href, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      <div className={cardStyles.popupHead}>
        <div className={cardStyles.backHead}>
          <div className={cardStyles.backHeadTop}>
            <h4 className={cardStyles.projectType}>{experience.position}</h4>
          </div>
          <div className={cardStyles.backTitleBlock}>
            <div className={cardStyles.backTitleRow}>
              {imageUrl && (
                <span className={cardStyles.experienceTitleIcon}>
                  <Icon
                    src={imageUrl}
                    alt={a11y('experience.detailLogo', { company: experience.company })}
                  />
                </span>
              )}
              <h3>{experience.company}</h3>
            </div>
          </div>
        </div>
      </div>
      <div className={cardStyles.backMetaRow}>
        {topLinks.length > 0 && (
          <div className={cardStyles.backMetaBlock}>
            <div className={cardStyles.links}>
              {topLinks.map((link, idx) =>
                link?.href ? (
                  <a
                    key={idx}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    onClick={handleOpenExternal(link.href)}
                  >
                    <Icon name="link" aria-hidden />
                    <strong className={cardStyles.linkType}>{getLinkTypeLabel(link.type)}</strong>
                    <span className={cardStyles.linkTitle}>{renderLinkTitle(link.title, cardStyles.linkSep)}</span>
                  </a>
                ) : (
                  <span key={idx} className={cardStyles.linkDisabled}>
                    <Icon name="link" aria-hidden />
                    <strong className={cardStyles.linkType}>{getLinkTypeLabel(link?.type)}</strong>
                    <span className={cardStyles.linkTitle}>{renderLinkTitle(link?.title, cardStyles.linkSep)}</span>
                  </span>
                )
              )}
            </div>
          </div>
        )}
        <div className={cardStyles.periodRight}>
          {formatExperienceDateFull(experience.startDate)} ~ {formatExperienceDateFull(experience.endDate)}
        </div>
      </div>
      <hr className={buildCls(cardStyles.backDivider, topLinks.length === 0 && cardStyles.backDividerTight)} />
      <div className={cardStyles.popupBody}>
        <div className={cardStyles.sections}>
          {sections.map((section) => (
            <article key={section.title} className={cardStyles.section}>
              <h5>{section.title}</h5>
              <ul>
                {(section.items || []).map((item, idx) => (
                  <li key={`${section.title}-${idx}`}>
                    {typeof item === 'string' ? renderRichText(item) : item}
                  </li>
                ))}
              </ul>
              {(section.links || []).length > 0 && (
                <div className={cardStyles.sectionLinks}>
                  {(section.links || []).map((link, idx) =>
                    link?.href ? (
                      <a
                        key={idx}
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                        onClick={handleOpenExternal(link.href)}
                      >
                        <Icon name="link" aria-hidden />
                        <strong className={cardStyles.linkType}>{getLinkTypeLabel(link.type)}</strong>
                        <span className={cardStyles.linkTitle}>{renderLinkTitle(link.title, cardStyles.linkSep)}</span>
                      </a>
                    ) : (
                      <span key={idx} className={cardStyles.linkDisabled}>
                        <Icon name="link" aria-hidden />
                        <strong className={cardStyles.linkType}>{getLinkTypeLabel(link?.type)}</strong>
                        <span className={cardStyles.linkTitle}>{renderLinkTitle(link?.title, cardStyles.linkSep)}</span>
                      </span>
                    )
                  )}
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </>
  );
}
