import { Icon } from '@components/shared/icon/Icon';
import { renderRichText, renderLinkTitle } from '@sections/projects/utils/richText';
import { getLinkTypeLabel } from '@sections/projects/utils/linkLabels';
import { formatExperienceDateFull } from '../../utils/dateFormat';
import { buildCls } from '../../utils/cssUtil';
import cardStyles from '@sections/projects/projectCard.module.css';

export function ExperienceDetailContent({ experience }) {
  const sections = experience.sections ?? [];
  const topLinks = experience.links ?? [];

  return (
    <>
      <div className={cardStyles.popupHead}>
        <div className={cardStyles.backHead}>
          <div className={cardStyles.backHeadTop}>
            <h4 className={cardStyles.projectType}>{experience.position}</h4>
          </div>
          <div className={cardStyles.backTitleBlock}>
            <div className={cardStyles.backTitleRow}>
              {experience.getImageUrl() ? (
                <span className={cardStyles.experienceTitleIcon} aria-hidden="true">
                  <Icon src={experience.getImageUrl()} alt="" />
                </span>
              ) : null}
              <h3>{experience.company}</h3>
            </div>
          </div>
        </div>
      </div>
      <div className={cardStyles.backMetaRow}>
        {topLinks.length > 0 ? (
          <div className={cardStyles.backMetaBlock}>
            <div className={cardStyles.links}>
              {topLinks.map((link, idx) =>
                link?.href ? (
                  <a
                    key={idx}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      window.open(link.href, '_blank', 'noopener,noreferrer');
                    }}
                  >
                    <Icon name="link" />
                    <strong className={cardStyles.linkType}>{getLinkTypeLabel(link.type)}</strong>
                    <span className={cardStyles.linkTitle}>{renderLinkTitle(link.title, cardStyles.linkSep)}</span>
                  </a>
                ) : (
                  <span key={idx} className={cardStyles.linkDisabled}>
                    <Icon name="link" />
                    <strong className={cardStyles.linkType}>{getLinkTypeLabel(link?.type)}</strong>
                    <span className={cardStyles.linkTitle}>{renderLinkTitle(link?.title, cardStyles.linkSep)}</span>
                  </span>
                )
              )}
            </div>
          </div>
        ) : null}
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
              {(section.links || []).length > 0 ? (
                <div className={cardStyles.sectionLinks}>
                  {(section.links || []).map((link, idx) =>
                    link?.href ? (
                      <a
                        key={idx}
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          window.open(link.href, '_blank', 'noopener,noreferrer');
                        }}
                      >
                        <Icon name="link" />
                        <strong className={cardStyles.linkType}>{getLinkTypeLabel(link.type)}</strong>
                        <span className={cardStyles.linkTitle}>{renderLinkTitle(link.title, cardStyles.linkSep)}</span>
                      </a>
                    ) : (
                      <span key={idx} className={cardStyles.linkDisabled}>
                        <Icon name="link" />
                        <strong className={cardStyles.linkType}>{getLinkTypeLabel(link?.type)}</strong>
                        <span className={cardStyles.linkTitle}>{renderLinkTitle(link?.title, cardStyles.linkSep)}</span>
                      </span>
                    )
                  )}
                </div>
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </>
  );
}
