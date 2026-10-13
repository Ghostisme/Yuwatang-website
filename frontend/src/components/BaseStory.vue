<template>
  <div class="base-story">
    <section class="base-story-section">
      <h2>{{ t("baseV2.moxibustionTitle") }}</h2>
      <div class="base-story-copy">
        <p>{{ t("baseV2.moxibustionIntro") }}</p>
      </div>
    </section>

    <section class="base-story-section">
      <h2>{{ t("baseV2.whyTitle") }}</h2>
      <div class="base-story-copy">
        <p>{{ t("baseV2.whyLead") }}</p>
        <div class="base-story-reasons">
          <div class="base-story-reason">
            <h3>{{ t("baseV2.whyQiaiTitle") }}</h3>
            <p>{{ t("baseV2.whyQiai") }}</p>
            <blockquote class="base-story-quote">
              {{ qiaiQuote.before }}<strong v-if="qiaiQuote.emphasis" class="base-story-quote-emphasis">{{ qiaiQuote.emphasis }}</strong>{{ qiaiQuote.after }}
            </blockquote>
          </div>
          <div class="base-story-reason">
            <h3>{{ t("baseV2.whyThreeTitle") }}</h3>
            <p>{{ t("baseV2.whyThree") }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="base-story-section">
      <h2>{{ t("baseV2.processTitle") }}</h2>
      <div class="base-story-copy">
        <p>{{ t("baseV2.processLead") }}</p>
        <ol class="base-story-steps">
          <li v-for="step in 4" :key="step">
            <span class="base-story-step-number" aria-hidden="true">0{{ step }}</span>
            <span class="base-story-step-label">{{ t(`baseV2.process${step}`) }}</span>
          </li>
        </ol>
      </div>
    </section>

    <section class="base-story-section">
      <h2>{{ t("baseV2.qualityTitle") }}</h2>
      <div class="base-story-copy">
        <p>{{ t("baseV2.qualityText") }}</p>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { useI18n } from "vue-i18n"

const { t } = useI18n()

const qiaiQuote = computed(() => {
  const text = t("baseV2.whyQiaiQuote")
  const emphasis = t("baseV2.whyQiaiTribute")
  const index = text.indexOf(emphasis)
  return {
    before: index < 0 ? text : text.slice(0, index),
    emphasis: index < 0 ? "" : emphasis,
    after: index < 0 ? "" : text.slice(index + emphasis.length)
  }
})
</script>

<style lang="scss" scoped>
.base-story-section {
  display: grid;
  grid-template-columns: 260px minmax(0, 1fr);
  column-gap: 48px;
  padding: 44px 0;
  border-bottom: 1px solid rgba(60, 50, 28, 0.1);

  &:first-child {
    padding-top: 0;
  }

  h2 {
    margin: 0;
    color: #3c321c;
    font-family: "LinHai", "Microsoft YaHei", var(--font-zh);
    font-size: 28px;
    font-weight: 600;
    line-height: 1.5;
    text-wrap: balance;

    &::before {
      content: "";
      display: block;
      width: 32px;
      height: 2px;
      margin-bottom: 16px;
      background: #b59a70;
    }
  }
}

.base-story-copy {
  min-width: 0;
  padding-top: 14px;

  p,
  .base-story-quote {
    margin: 0;
    color: rgba(60, 50, 28, 0.74);
    font-size: 16px;
    line-height: 1.95;
    overflow-wrap: break-word;
  }

  .base-story-quote {
    margin-top: 20px;
    padding-left: 16px;
    border-left: 2px solid #b59a70;
    color: #786044;
  }
}

.base-story-quote-emphasis {
  padding: 2px 4px;
  border-radius: 2px;
  background: rgba(181, 154, 112, 0.16);
  color: #6e5435;
  font-weight: 700;
}

.base-story-reasons {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 32px;
  margin-top: 28px;
}

.base-story-reason {
  padding-top: 20px;
  border-top: 1px solid rgba(60, 50, 28, 0.12);

  h3 {
    margin: 0 0 12px;
    color: #6e5435;
    font-size: 18px;
    font-weight: 600;
    line-height: 1.6;
  }
}

.base-story-steps {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  margin: 24px 0 0;
  padding: 0;
  list-style: none;

  li {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    min-width: 0;
    padding: 20px 16px;
    border: 1px solid rgba(164, 132, 85, 0.16);
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.64);
  }
}

.base-story-step-number {
  color: #aa8755;
  font-family: Georgia, serif;
  font-size: 28px;
  font-variant-numeric: tabular-nums;
  line-height: 1;
}

.base-story-step-label {
  color: #59472e;
  font-size: 15px;
  font-weight: 500;
  line-height: 1.7;
  overflow-wrap: break-word;
}

@media (max-width: 1100px) {
  .base-story-section {
    grid-template-columns: 210px minmax(0, 1fr);
    column-gap: 36px;
  }

  .base-story-steps {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 768px) {
  .base-story-section {
    grid-template-columns: minmax(0, 1fr);
    gap: 20px;
    padding: 32px 0;

    h2 {
      font-size: 23px;

      &::before {
        width: 28px;
        margin-bottom: 12px;
      }
    }
  }

  .base-story-copy {
    padding-top: 0;

    p,
    .base-story-quote {
      font-size: 15px;
      line-height: 1.85;
    }
  }

  .base-story-reasons {
    grid-template-columns: minmax(0, 1fr);
    gap: 24px;
    margin-top: 24px;
  }

  .base-story-reason {
    padding-top: 18px;

    h3 {
      margin-bottom: 10px;
      font-size: 17px;
    }
  }

  .base-story-steps {
    gap: 10px;
    margin-top: 20px;

    li {
      gap: 10px;
      padding: 18px 14px;
    }
  }

  .base-story-step-number {
    font-size: 26px;
  }
}
</style>
